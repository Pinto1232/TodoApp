#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

const tscArgs = ['tsc', '--project', 'tsconfig.dev.json', '--watch', '--preserveWatchOutput'];
const tsc = spawn('npx', tscArgs, {
  cwd: root,
  stdio: ['inherit', 'pipe', 'inherit'],
});

let server;
let stdoutBuffer = '';
let pendingRestart = false;
let serverStarted = false;

function startServer() {
  if (server) return;
  serverStarted = true;
  server = spawn('node', ['dist/index.js'], {
    cwd: root,
    stdio: 'inherit',
  });
  server.on('exit', () => {
    server = undefined;
    if (pendingRestart) {
      pendingRestart = false;
      startServer();
    }
  });
}

function restartServer() {
  if (!server) {
    startServer();
    return;
  }
  pendingRestart = true;
  server.kill();
}

function handleTscLine(line) {
  if (line.includes('Found 0 errors')) {
    restartServer();
  }
}

tsc.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  stdoutBuffer += text;
  const lines = stdoutBuffer.split(/\r?\n/);
  stdoutBuffer = lines.pop() || '';
  for (const line of lines) {
    handleTscLine(line);
  }
  if (stdoutBuffer.length > 4096) {
    stdoutBuffer = stdoutBuffer.slice(-4096);
  }
});

tsc.on('exit', (code, signal) => {
  if (!serverStarted) {
    process.exitCode = code ?? 1;
  }
});

const cleanExit = () => {
  tsc.kill();
  if (server) {
    server.kill();
  }
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);

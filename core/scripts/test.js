#!/usr/bin/env node
const { runCLI } = require('@jest/core');
const path = require('node:path');
const jestConfig = require('../jest.config');

async function main() {
  const cwd = path.resolve(__dirname, '..');
  const { results } = await runCLI(
    {
      runInBand: true,
      config: JSON.stringify(jestConfig),
    },
    [cwd],
  );

  process.exit(results.success ? 0 : 1);
}

main().catch((error) => {
  // Ensure any unhandled errors still fail the process
  console.error(error);
  process.exit(1);
});

/**
 * Logger Service
 *
 * Centralized logging with structured output.
 * Supports different log levels and formats based on environment.
 *
 * Follows: Single Responsibility Principle (SRP)
 */

import { getConfig } from './config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    const config = getConfig();
    return LOG_LEVELS[level] >= LOG_LEVELS[config.log.level];
  }

  private formatMessage(entry: LogEntry): string {
    const config = getConfig();

    if (config.log.format === 'json') {
      return JSON.stringify(entry);
    }

    // Pretty format for development
    const levelColors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m', // Green
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    const color = levelColors[entry.level];
    const contextStr = entry.context ? `[${entry.context}] ` : '';
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';

    return `${entry.timestamp} ${color}${entry.level.toUpperCase().padEnd(5)}${reset} ${contextStr}${entry.message}${dataStr}`;
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
    };

    const formatted = this.formatMessage(entry);

    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): Logger {
    return new Logger(context);
  }
}

// Default logger instance
export const logger = new Logger();

/**
 * Create a logger with a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

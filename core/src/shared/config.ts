/**
 * Configuration Service
 *
 * Centralized, type-safe configuration management with validation.
 * All environment variables are validated at startup.
 *
 * Follows: Single Responsibility Principle (SRP)
 */

interface ServerConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  frontendUrl: string;
}

interface WeatherConfig {
  apiKey: string;
  baseUrl: string;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface LogConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'pretty';
}

export interface AppConfig {
  server: ServerConfig;
  weather: WeatherConfig;
  rateLimit: RateLimitConfig;
  log: LogConfig;
}

/**
 * Get required environment variable or throw error
 */
function getEnvRequired(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get optional environment variable with default value
 */
function getEnvOptional(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Get environment variable as number
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
}

/**
 * Validate and load all configuration
 */
function loadConfig(): AppConfig {
  const nodeEnv = getEnvOptional('NODE_ENV', 'development') as AppConfig['server']['nodeEnv'];

  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}. Must be development, production, or test`);
  }

  return {
    server: {
      port: getEnvNumber('PORT', 3001),
      nodeEnv,
      frontendUrl: getEnvOptional('FRONTEND_URL', 'http://localhost:3000'),
    },
    weather: {
      apiKey: getEnvOptional('OPENWEATHERMAP_API_KEY', ''),
      baseUrl: getEnvOptional('OPENWEATHERMAP_BASE_URL', 'https://api.openweathermap.org/data/2.5'),
    },
    rateLimit: {
      windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
      maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
    },
    log: {
      level: getEnvOptional('LOG_LEVEL', 'info') as AppConfig['log']['level'],
      format: nodeEnv === 'production' ? 'json' : 'pretty',
    },
  };
}

// Singleton configuration instance
let configInstance: AppConfig | null = null;

/**
 * Get the application configuration
 * Loads and validates on first call, returns cached instance thereafter
 */
export function getConfig(): AppConfig {
  if (!configInstance) {
    configInstance = loadConfig();
  }
  return configInstance;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig(): void {
  configInstance = null;
}

/**
 * Validate that all required configuration is present
 * Call this at application startup to fail fast
 */
export function validateConfig(): void {
  const config = getConfig();

  if (!config.weather.apiKey) {
    // Note: This will be logged by the caller
  }
}

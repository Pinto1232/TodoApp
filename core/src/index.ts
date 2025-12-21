import 'dotenv/config';
import { createApp } from './app';
import { getConfig, validateConfig, createLogger } from './todo.shared';

const logger = createLogger('Server');

// Validate configuration at startup
validateConfig();

const config = getConfig();
const app = createApp();

app.listen(config.server.port, () => {
  logger.info(`🚀 Server is running on http://localhost:${config.server.port}`);
  logger.info(`📚 API Docs at http://localhost:${config.server.port}/api/docs`);
  logger.info(`❤️  Health check at http://localhost:${config.server.port}/api/health`);
});

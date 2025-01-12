import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import express from 'express';
import pino from 'pino';

dotenv.config();

const app = express();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

const bootstrap = async () => {
  await initMongoConnection();
  setupServer(app, logger);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

bootstrap();

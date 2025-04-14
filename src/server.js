import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import pino from 'pino';
import cors from 'cors'; // импортируем cors

import authRouter from './routers/auth.js';
import contactRouter from './routers/contact.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export const setupServer = async () => {
  const app = express();

  try {
    await initMongoConnection();
    logger.info('MongoDB connection successfully established!');
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }

  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'https://nodejs-hw-mongodb-89ov.onrender.com',
    ],
    credentials: true, 
  };
  app.use(cors(corsOptions)); 

  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter);
  app.use('/contacts', contactRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

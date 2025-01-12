import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routes/contactsRouter.js';

export const setupServer = (app, logger) => {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use(cors());

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
};

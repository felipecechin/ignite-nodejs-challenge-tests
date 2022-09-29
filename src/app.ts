import 'reflect-metadata';
import 'dotenv/config'
import 'express-async-errors';
import './shared/container';

import { AppError } from './shared/errors/AppError';
import cors from 'cors';
import createConnection from './database';
import express from 'express';
import { router } from './routes';

if (process.env.NODE_ENV !== 'test') {
  createConnection();
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', router);

app.use(
  (err: Error, request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} `,
    });
  }
);

export { app };

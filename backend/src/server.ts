import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDB } from './config/database';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import router from './routes/index';

app.use('/api/v1', router);

app.use(errorHandler);
app.use(notFoundHandler);

const appPort = process.env.PORT ?? 6200;

const startServer = async () => {
  await connectToDB(); // connect to DB first
  app.listen(appPort, () => {
    console.log(`🚀 App listening on http://localhost:${appPort}`);
  });
};

startServer();

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from '@sirjhep/ticketing-common';
import cors from 'cors';
import cookieSession from 'cookie-session';
import createChargeRouter from './routes/new';

export const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(json());
app.use(
  cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false,
  })
);

app.use(currentUser);

// routers here
app.use(createChargeRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './route/current-user';
import { signInRouter } from './route/signin';
import { signOutRouter } from './route/signout';
import { signUpRouter } from './route/signup';
import { NotFoundError, errorHandler } from '@sirjhep/ticketing-common';
import cors from 'cors';
import cookieSession from 'cookie-session';

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

app.get('/api/users/count', function (req, res) {
  // Update views
  req.session = {
    views: (req.session?.views || 0) + 1,
  };

  // Write response
  res.end(req.session.views + ' views');
});

app.use(currentUserRouter, signInRouter, signOutRouter, signUpRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;

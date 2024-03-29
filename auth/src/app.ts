import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@ticx/common';
import cookieSession from 'cookie-session';

const app = express();
app.use(json());

// Trust traffic that is proxyed to application through ingress nginx is secured
app.set('trust proxy', true);

// disable encryption for cookie as JWT already encrypted
app.use(
  // using HTTP for testing and HTTPS otherwise
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// express captures the error and sends to middleware
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

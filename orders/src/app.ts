import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUser, errorHandler, NotFoundError } from '@ticx/common';
import cookieSession from 'cookie-session';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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

// This line has to occur after cookieSession()
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

// express captures the error and sends to middleware
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

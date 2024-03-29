import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '@ticx/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@ticx/common';
import { AuthCreatedPublisher } from '../events/publishers/auth-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    // validation
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  // validation must be done first before error handling (middlewares run in sequence)
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is used');
    }

    const user = User.build({ email, password });
    await user.save();

    // generate jwt (signing key shared with other services, which is stored securely)
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },

      // check for env var is alr done at startup
      process.env.JWT_KEY!
    );

    // store to session cookie
    req.session = { jwt: userJwt };

    // publish auth created event
    new AuthCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      email: user.email,
    });

    res.status(201).send(user);
  }
);

export { router as signupRouter };

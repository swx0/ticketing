import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@ticx/common';
import { Password } from '../services/password';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be applied'),
  ],
  // validation must be done first before error handling (middlewares run in sequence)
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // generate jwt (signing key shared with other services, which is stored securely)
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },

      // check for env var is alr done at startup
      process.env.JWT_KEY!
    );

    // store to session cookie
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };

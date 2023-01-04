import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ticx/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Profile } from '../../models/profile';
const router = express.Router();

router.put(
  '/api/profiles/:id',
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== profile.id) {
      throw new NotAuthorisedError();
    }

    // changes to profile (for future)

    res.send(profile);
  }
);

export { router as updateProfileRouter };

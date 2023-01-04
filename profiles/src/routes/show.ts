import { NotFoundError } from '@ticx/common';
import express, { Request, Response } from 'express';
import { Profile } from '../../models/profile';
const router = express.Router();

router.get('/api/profiles/:id', async (req: Request, res: Response) => {
  // Find the profile in db
  const profile = await Profile.findById(req.params.id).populate('reviews');

  if (!profile) {
    throw new NotFoundError();
  }

  res.send(profile);
});

export { router as showProfileRouter };

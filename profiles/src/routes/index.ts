import express, { Request, Response } from 'express';
import { Profile } from '../../models/profile';
const router = express.Router();

router.get('/api/profiles', async (req: Request, res: Response) => {
  // find all profiles
  const profiles = await Profile.find({});

  res.send(profiles);
});

export { router as indexProfileRouter };

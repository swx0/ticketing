import { NotFoundError } from '@ticx/common';
import express, { Request, Response } from 'express';
import { Review } from '../../models/review';
const router = express.Router();

router.get('/api/reviews/:id', async (req: Request, res: Response) => {
  // Find the review in db
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new NotFoundError();
  }

  res.send(review);
});

export { router as showReviewRouter };

import express, { Request, Response } from 'express';
import { Review } from '../../models/review';
const router = express.Router();

router.get('/api/reviews', async (req: Request, res: Response) => {
  // find all reviews
  const reviews = await Review.find({});

  res.send(reviews);
});

export { router as indexReviewRouter };

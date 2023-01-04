import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ticx/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Review } from '../../models/review';
import { ReviewUpdatedPublisher } from '../events/publishers/review-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put(
  '/api/reviews/:id',
  requireAuth,
  [
    body('content')
      .not()
      .isEmpty()
      .withMessage('Review description is required'),
    body('rating').not().isEmpty().withMessage('Rating is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== review.reviewerId) {
      throw new NotAuthorisedError();
    }

    review.set({ content: req.body.content, rating: req.body.rating });

    await review.save();

    new ReviewUpdatedPublisher(natsWrapper.client).publish({
      id: review.id,
      orderId: review.orderId,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      rating: review.rating,
      content: review.content,
      version: review.version,
    });

    res.send(review);
  }
);

export { router as updateReviewRouter };

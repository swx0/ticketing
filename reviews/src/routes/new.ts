import { NotFoundError, requireAuth, validateRequest } from '@ticx/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Review } from '../../models/review';
import { Order } from '../../models/order';
import { ReviewCreatedPublisher } from '../events/publishers/review-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post(
  '/api/reviews',
  requireAuth,
  [
    // custom() used to validate if ticketId has structure of mongodb id
    body('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('OrderId must be provided'),
    body('rating').not().isEmpty().withMessage('Rating must be provided'),
    body('content')
      .not()
      .isEmpty()
      .withMessage('Review description must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, rating, content } = req.body;

    // Find the order to be reviewed in db
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    console.log(order);

    // Build the review and save to db
    const review = Review.build({
      orderId,
      reviewerId: req.currentUser!.id,
      revieweeId: order.ticketUserId,
      rating,
      content,
    });
    await review.save();

    new ReviewCreatedPublisher(natsWrapper.client).publish({
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

export { router as newReviewRouter };

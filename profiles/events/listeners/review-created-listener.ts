import {
  Listener,
  Subjects,
  ReviewCreatedEvent,
  NotFoundError,
} from '@ticx/common';
import { Message } from 'node-nats-streaming';
import { Profile } from '../../models/profile';
import { Review } from '../../models/review';
import { queueGroupName } from './queue-group-name';

export class ReviewCreatedListener extends Listener<ReviewCreatedEvent> {
  readonly subject = Subjects.ReviewCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: ReviewCreatedEvent['data'], msg: Message) {
    // add review to review db
    const review = Review.build({
      id: data.id,
      orderId: data.orderId,
      reviewerId: data.reviewerId,
      revieweeId: data.revieweeId,
      rating: data.rating,
      content: data.content,
      version: data.version,
    });
    console.log(review);

    await review.save();

    // add review to reviewee profile
    const revieweeProfile = await Profile.findById(review.revieweeId);

    if (!revieweeProfile) {
      throw new NotFoundError();
    }

    revieweeProfile.reviews?.push(review);
    await revieweeProfile.save();

    msg.ack();
  }
}

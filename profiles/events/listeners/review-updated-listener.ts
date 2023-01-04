import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ReviewUpdatedEvent } from '@ticx/common';
import { queueGroupName } from './queue-group-name';
import { Review } from '../../models/review';
import { Profile } from '../../models/profile';

export class ReviewUpdatedListener extends Listener<ReviewUpdatedEvent> {
  readonly subject = Subjects.ReviewUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ReviewUpdatedEvent['data'], msg: Message) {
    // find using id and version number
    // will only update if review event received's version number is 1 more than version number in db
    const review = await Review.findByEvent(data);

    // event is reissued after 5s if version number is wrong
    if (!review) {
      throw new Error('Review not found');
    }

    review.set({ rating: data.rating, content: data.content });
    await review.save();

    // update review found in profile db
    await Profile.findOneAndUpdate(
      { _id: review.revieweeId, 'reviews._id': review.id },
      { rating: data.rating, content: data.content }
    );

    msg.ack();
  }
}

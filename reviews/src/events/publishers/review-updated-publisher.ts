import { Publisher, ReviewUpdatedEvent, Subjects } from '@ticx/common';

export class ReviewUpdatedPublisher extends Publisher<ReviewUpdatedEvent> {
  readonly subject = Subjects.ReviewUpdated;
}

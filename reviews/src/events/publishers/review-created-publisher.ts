import { Publisher, ReviewCreatedEvent, Subjects } from '@ticx/common';

export class ReviewCreatedPublisher extends Publisher<ReviewCreatedEvent> {
  readonly subject = Subjects.ReviewCreated;
}

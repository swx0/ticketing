import { Publisher, OrderCreatedEvent, Subjects } from '@ticx/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

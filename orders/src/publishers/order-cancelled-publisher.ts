import { Publisher, OrderCancelledEvent, Subjects } from '@ticx/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

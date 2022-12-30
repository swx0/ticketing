import { PaymentCreatedEvent, Publisher, Subjects } from '@ticx/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

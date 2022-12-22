import { Publisher, TicketUpdatedEvent, Subjects } from '@ticx/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

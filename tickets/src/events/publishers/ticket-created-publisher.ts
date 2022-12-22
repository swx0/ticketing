import { Publisher, TicketCreatedEvent, Subjects } from '@ticx/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

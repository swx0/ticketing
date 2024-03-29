import { Listener, Subjects, TicketCreatedEvent } from '@ticx/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price, userId } = data;
    const ticket = Ticket.build({ id, title, price, userId });
    await ticket.save();

    msg.ack();
  }
}

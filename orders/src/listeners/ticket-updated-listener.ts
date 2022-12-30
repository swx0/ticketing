import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@ticx/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // find using id and version number
    // will only update if ticket event received's version number is 1 more than version number in db
    const ticket = await Ticket.findByEvent(data);

    // event is reissued after 5s if version number is wrong
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

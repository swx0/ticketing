import { Listener, OrderCreatedEvent, Subjects } from '@ticx/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // Throw error if no ticket
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark ticket as reserved by setting id of order to orderId of ticket
    ticket.set({ orderId: data.id });

    // Save ticket to db
    await ticket.save();

    // used to update version num of tickets
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack message
    msg.ack();
  }
}

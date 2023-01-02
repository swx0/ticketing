import { Listener, OrderCreatedEvent, Subjects } from '@ticx/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    if (
      typeof data.ticket.title !== 'string' ||
      typeof data.ticket.userId !== 'string'
    ) {
      console.log(data.ticket.title);
      console.log(data.ticket.userId);
      throw new Error('Invalid ObjectCreatedEvent');
    }

    const order = Order.build({
      id: data.id,
      title: data.ticket.title,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
      ticketUserId: data.ticket.userId,
    });
    console.log(order);

    await order.save();

    msg.ack();
  }
}

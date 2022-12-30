import { Listener, OrderCreatedEvent } from '@ticx/common';
import { Subjects } from '@ticx/common/build/events/subjects';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Delayed time:', delay);

    // enqueue job
    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  }
}

import { TicketCreatedEvent } from '@ticx/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  // create instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // creates a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 123,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ticket created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack called
  expect(msg.ack).toHaveBeenCalled();
});

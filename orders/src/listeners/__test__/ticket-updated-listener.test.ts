import { TicketCreatedEvent, TicketUpdatedEvent } from '@ticx/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create a new ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // creates a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert new',
    price: 123,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ticket updated
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg, ticket } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack if out-of-order event listened', async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;

  // call onMessage function with data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  // write assertions to make sure ack called
  expect(msg.ack).not.toHaveBeenCalled();
});

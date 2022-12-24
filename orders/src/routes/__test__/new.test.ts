import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if ticket is already reserved', async () => {
  // create ticket and save to db
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  // create order with this ticket and save to db
  const order = Order.build({
    userId: 'dsadac',
    status: OrderStatus.Created,
    expiresAt: new Date(), // expiresAt is not tested here
    ticket,
  });
  await order.save();

  // try to order this ticket
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // create ticket and save to db
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits order created event', async () => {
  // create ticket and save to db
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

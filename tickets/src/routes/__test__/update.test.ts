import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if id does not exist', async () => {
  // generate id that fits requirement of mongo
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({ title: 'asdsc', price: 20 })
    .expect(404);
});

it('returns a 401 if user not auth', async () => {
  // generate id that fits requirement of mongo
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'asdsc', price: 20 })
    .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'sdasdsc', price: 20 });

  // update the ticket that has just been created
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({ title: 'dssad', price: 1000 })
    .expect(401);
});

it('returns a 400 if invalid title or price', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'sdasdsc', price: 20 });

  // update the ticket that has just been created (Invalid price)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dssad', price: -1000 })
    .expect(400);

  // update the ticket that has just been created (Invalid title)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 1000 })
    .expect(400);
});

it('updates ticket with valid inputs', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'sdasdsc', price: 20 });

  // update the ticket that has just been created
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dssd', price: 1000 })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketRes.body.title).toEqual('dssd');
  expect(ticketRes.body.price).toEqual(1000);
});

it('publishes an event', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'sdasdsc', price: 20 });

  // update the ticket that has just been created
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dssd', price: 1000 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if ticket is reserved', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'sdasdsc', price: 20 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  // update the ticket that has just been created
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dssd', price: 1000 })
    .expect(400);
});

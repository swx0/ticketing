import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('can fetch a list of tickets', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'asds', price: 20 });
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'asds', price: 20 });
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'asds', price: 20 });

  const response = await request(app).get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(3);
});

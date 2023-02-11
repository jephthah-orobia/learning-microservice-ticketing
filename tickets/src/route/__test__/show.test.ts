import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { cookieOfSignIn } from '../../test/setup';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test'),
    title = 'Some Events',
    price = 1234.12;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price });

  expect(response.status).toBe(201);
  expect(response.body).toBeDefined;
  expect(response.body.id).toBeDefined;
  const ticket_id = response.body.id;

  const res = await request(app).get(`/api/tickets/${ticket_id}`).send();
  expect(res.status).toEqual(200);
  expect(res.body).toBeDefined;
  expect(res.body.title).toEqual(title);
  expect(res.body.price).toEqual(price);
  expect(res.body.userId).toEqual(userId);
});

it('if :id is not stated, return all tickets in db', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test'),
    data = [
      { title: 'Some Event 1', price: 123.4 },
      { title: 'Some Event 2', price: 12.34 },
      { title: 'Some Event 3', price: 1.234 },
      { title: 'Some Event 4', price: 0.1234 },
    ];

  let tickets = await Ticket.find({});

  expect(tickets.length).toBe(0);

  for (let e of data) {
    await request(app).post('/api/tickets').set('Cookie', cookie).send(e);
  }

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(4);

  const result = await request(app).get('/api/tickets').send();

  expect(result.body.length).toEqual(4);
});

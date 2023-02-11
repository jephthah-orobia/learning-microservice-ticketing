import request from 'supertest';
import { app } from '../../app';
import { cookieOfSignIn } from '../../test/setup';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to api/tickets for post request', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('if the user is signed in, expect status not to be 401', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookieOfSignIn('test@test.test').cookie)
    .send({});
  expect(res.status).not.toEqual(401);
  expect(res.status).not.toEqual(403);
});

it('returns an error if an invalid title is provided', async () => {
  const { cookie } = cookieOfSignIn('test@test.test');
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(res.status).toBe(400);
  expect(res.body[0].field).toBe('title');

  const res1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ price: 10 });

  expect(res1.status).toBe(400);
  expect(res1.body[0].field).toBe('title');

  const res2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '', price: 10 });

  expect(res2.status).toBe(400);
  expect(res2.body[0].field).toBe('title');
});

it('returns an error if an invalid price is provided', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test');
  const res2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'SomeTitle', price: -10 });

  expect(res2.status).toBe(400);
  expect(res2.body[0].field).toBe('price');

  const res1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'SomeTitle', price: 0 });

  expect(res1.status).toBe(400);
  expect(res1.body[0].field).toBe('price');

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'SomeTitle' });

  expect(res.status).toBe(400);
  expect(res.body[0].field).toBe('price');
});

it('creates a ticket with valid inputs', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test');

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const res2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'SomeTitle', price: 112.1 });

  expect(res2.status).toBe(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('SomeTitle');
  expect(tickets[0].price).toEqual(112.1);
  expect(tickets[0].userId).toEqual(userId);
});

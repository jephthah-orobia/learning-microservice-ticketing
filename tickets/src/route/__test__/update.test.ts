import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { cookieOfSignIn } from '../../test/setup';

it('should return 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'New Title', price: 123.34 })
    .expect(401);
});

it('should return 403 if ticket the user does not own the ticket', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test');
  const res = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({ title: 'Some Title', price: 123.34 })
    .expect(201);

  const newUser = cookieOfSignIn('test1@test.test');

  expect(res.body.id).toBeDefined();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', newUser.cookie)
    .send({ title: 'New Title', price: 123.34 })
    .expect(403);
});

it('should return 404 if ticket is not found', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test');
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set(`Cookie`, cookie)
    .send({ title: 'New Title', price: 123.34 })
    .expect(404);
});

it('should return 400 if title or password is invalid', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test');
  const res = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({ title: 'Some Title', price: 123.34 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 12 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some', price: -1 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some' })
    .expect(400);
});

it('should update ticket if it exists and if user owns it', async () => {
  const { cookie, userId } = cookieOfSignIn('test@test.test');
  const res = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({ title: 'Some Title', price: 123.34 })
    .expect(201);

  expect(res.body.id).toBeDefined();

  const ticket = await Ticket.findById(res.body.id);

  expect(ticket).toBeTruthy();
  expect(ticket!.title).toEqual('Some Title');

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New Title', price: 123.34 })
    .expect(201);

  const new_ticket = await Ticket.findById(res.body.id);
  expect(new_ticket).toBeTruthy();
  expect(new_ticket!.title).toEqual('New Title');
});

import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { cookieOfSignIn } from '../../test/setup';
import { natsu } from '@sirjhep/ticketing-common';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const user = cookieOfSignIn('test@test.test');
  await request(app)
    .post('/api/orders')
    .set('Cookie', user.cookie)
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'some concert',
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    ticket: ticket.id,
    userId: 'some user',
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookieOfSignIn('test@test.test').cookie)
    .send({ ticketId: ticket.id })
    .expect(401);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'some concert',
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookieOfSignIn('test@test.test').cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('Test event emmision', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'some concert',
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookieOfSignIn('test@test.test').cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsu.client.publish).toHaveBeenCalled();
});

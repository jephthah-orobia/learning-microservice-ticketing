import request from 'supertest';
import app from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { cookieOfSignIn } from '../../test/setup';
import mongoose from 'mongoose';
import { natsu } from '@sirjhep/ticketing-common';

const buildTicket = async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: ticketId.toString(),
    title: 'some concert',
    price: 1234154.2,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = cookieOfSignIn('test1@test.test');
  const user2 = cookieOfSignIn('test2@test.test');

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1.cookie)
    .send({ ticketId: ticket1.id })
    .expect(201);

  expect(natsu.client.publish).toHaveBeenCalled();

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1.cookie)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2.cookie)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const { body: fetchUser1 } = await request(app)
    .get('/api/orders')
    .set('Cookie', user1.cookie)
    .send()
    .expect(200);

  const { body: fetchUser2 } = await request(app)
    .get('/api/orders')
    .set('Cookie', user2.cookie)
    .send()
    .expect(200);

  expect(fetchUser1.length).toEqual(2);
  expect(fetchUser2.length).toEqual(1);

  expect(fetchUser1[0].userId).toEqual(user1.userId);
  expect(fetchUser1[1].userId).toEqual(user1.userId);
  expect(fetchUser2[0].userId).toEqual(user2.userId);

  expect(fetchUser1[0].ticket).toEqual(JSON.parse(JSON.stringify(ticket1)));
  expect(fetchUser1[1].ticket).toEqual(JSON.parse(JSON.stringify(ticket2)));
  expect(fetchUser2[0].ticket).toEqual(JSON.parse(JSON.stringify(ticket3)));
});

it('/api/orders/:id should return a specified order', async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = cookieOfSignIn('test1@test.test');
  const user2 = cookieOfSignIn('test2@test.test');

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1.cookie)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1.cookie)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2.cookie)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const { body: response1 } = await request(app)
    .get('/api/orders/' + orderOne.id)
    .set('Cookie', user1.cookie)
    .send()
    .expect(200);

  const { body: response2 } = await request(app)
    .get('/api/orders/' + orderOne.id)
    .set('Cookie', user2.cookie)
    .send()
    .expect(403);
});

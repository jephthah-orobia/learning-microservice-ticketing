import app from '../../app';
import request from 'supertest';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { cookieOfSignIn } from '../../test/setup';

it('Successfuly update an order', async () => {
  const ticket = Ticket.build({
    title: 'some concert',
    price: 20,
  });

  await ticket.save();

  const user = cookieOfSignIn('test@test.test');
  const user1 = cookieOfSignIn('test1@test.test');

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user.cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user.cookie)
    .send()
    .expect(400);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user.cookie)
    .send({ status: '' })
    .expect(400);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user.cookie)
    .send({ status: 'something else' })
    .expect(400);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user1.cookie)
    .send({ status: OrderStatus.AwaitingPayment })
    .expect(403);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user.cookie)
    .send({ status: OrderStatus.AwaitingPayment })
    .expect(201);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user.cookie)
    .send({ status: OrderStatus.Complete })
    .expect(201);
});

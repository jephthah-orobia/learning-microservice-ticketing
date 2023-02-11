import { Order, OrderStatus } from '../../models/order';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { cookieOfSignIn } from '../../test/setup';

it('returns a 404 when purchasing an order that does not exist', async () => {
  const user = cookieOfSignIn('test@test.test');
  await request(app)
    .post('/api/payments')
    .set('Cookie', user.cookie)
    .send({
      token: 'asdgasd',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when an order that doesnt belong to the user', async () => {
  const user1 = cookieOfSignIn('test@test.test');
  const user2 = cookieOfSignIn('test2@test.test');

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 214.12,
    userId: user1.userId,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', user2.cookie)
    .send({
      token: 'asdgasd',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 500 when purchasing a cancelled order', async () => {
  const user2 = cookieOfSignIn('test2@test.test');

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    price: 214.12,
    userId: user2.userId,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', user2.cookie)
    .send({
      token: 'asdgasd',
      orderId: order.id,
    })
    .expect(400);
});

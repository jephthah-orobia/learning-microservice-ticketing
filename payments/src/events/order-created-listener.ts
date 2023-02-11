import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@sirjhep/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = 'payment-service';
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      userId: data.userId,
      status: data.status,
    });

    await order.save();

    msg.ack();
  }
}

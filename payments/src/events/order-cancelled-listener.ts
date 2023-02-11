import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@sirjhep/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = 'payment-service';
  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findByEventData(data);

    if (!order) throw new Error('Order not found!');

    if (OrderStatus.Cancelled != order.status)
      order.status = OrderStatus.Cancelled;

    await order.save();
    msg.ack();
  }
}

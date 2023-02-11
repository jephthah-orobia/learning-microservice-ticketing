import {
  ExpirationCompleteEvent,
  Listener,
  natsu,
  OrderStatus,
  Subjects,
} from '@sirjhep/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from './order-canceled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = 'order-service';
  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.id).populate('ticket');

    if (!order) throw new Error('Order not found!');

    if (
      [OrderStatus.Created, OrderStatus.AwaitingPayment].includes(
        order.status as OrderStatus
      )
    ) {
      order.status = OrderStatus.Cancelled;

      const newOrder = await order.save();

      new OrderCancelledPublisher(natsu.client).publish({
        id: newOrder.id,
        ticket: {
          id: newOrder.ticket.id,
          __v: newOrder.ticket.__v + 1,
        },
        __v: newOrder.__v,
      });
    }

    msg.ack();
  }
}

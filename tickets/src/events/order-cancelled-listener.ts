import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@sirjhep/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from './ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = 'ticket-service';
  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findByEventData(data.ticket);

    if (!ticket) throw new Error('Ticket not found!');

    ticket.set('orderId', null);
    const newTicket = await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
      __v: newTicket.__v,
    });

    msg.ack();
  }
}

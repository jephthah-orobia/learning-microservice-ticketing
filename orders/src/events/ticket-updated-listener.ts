import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from '@sirjhep/ticketing-common';
import { Ticket, TicketDoc } from '../models/ticket';
import { Error } from 'mongoose';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = 'order-service';
  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    try {
      const doc = await Ticket.findByEventData(data);
      if (!doc) throw new Error('Ticket not found!');

      doc.set('title', data.title);
      doc.set('price', data.price);
      doc.markModified('title');
      const newdoc = await doc.save();
      msg.ack();
    } catch (e) {
      throw e;
    }
  }
}

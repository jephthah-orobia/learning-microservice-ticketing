import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from '@sirjhep/ticketing-common';
import { Ticket } from '../models/ticket';
import { isCatchClause } from 'typescript';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'order-service';
  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    try {
      await ticket.save();
      msg.ack();
    } catch (e) {
      throw e;
    }
  }
}

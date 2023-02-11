import { natsu, TicketCreatedEvent } from '@sirjhep/ticketing-common';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async (): Promise<{
  listener: TicketCreatedListener;
  data: TicketCreatedEvent['data'];
  message: { ack(): jest.Mock };
}> => {
  const listener = new TicketCreatedListener(natsu.client);

  const data = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Some Event',
    price: 123.4,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('creates and saves a ticket', async () => {
  const { listener, data, message } = await setup();
  // @ts-ignore
  await listener.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // @ts-ignore
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

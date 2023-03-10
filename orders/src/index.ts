import { app } from './app';
import mongoose from 'mongoose';
import { natsu } from '@sirjhep/ticketing-common';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketUpdatedListener } from './events/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/expiration-complete-listener';

mongoose.set('strictQuery', false);

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('jwt key not defined!');
  if (!process.env.DB_URI) throw new Error('uri key not defined!');
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('nats cluster id key not defined!');
  if (!process.env.NATS_CLIENT_ID)
    throw new Error('nats client id not defined!');
  if (!process.env.NATS_URL) throw new Error('nats url not defined!');
  try {
    await natsu.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    new TicketCreatedListener(natsu.client).listen();
    new TicketUpdatedListener(natsu.client).listen();

    new ExpirationCompleteListener(natsu.client).listen();

    await mongoose.connect(process.env.DB_URI);

    app.listen(3000, () => {
      console.log('Orders Services listening to port 3000!');
    });
  } catch (e) {
    console.error(e);
  }
};

start();

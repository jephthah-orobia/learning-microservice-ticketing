import { natsu, Subjects } from '@sirjhep/ticketing-common';
import { OrderCreatedListener } from './events/order-created-listener';

const start = async () => {
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

    new OrderCreatedListener(natsu.client).listen();

    console.log('Expiration Services is listening for', Subjects.OrderCreated);
  } catch (e) {
    console.error(e);
  }
};

start();

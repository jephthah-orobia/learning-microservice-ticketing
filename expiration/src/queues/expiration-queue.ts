import { natsu } from '@sirjhep/ticketing-common';
import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/expiration-complete-publisher';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsu.client).publish({
    id: job.data.orderId,
    __v: 1,
  });
});

export { expirationQueue };

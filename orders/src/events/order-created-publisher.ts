import {
  Subjects,
  Publisher,
  OrderCreatedEvent,
} from '@sirjhep/ticketing-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

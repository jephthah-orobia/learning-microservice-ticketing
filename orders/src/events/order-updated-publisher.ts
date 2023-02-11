import {
  Subjects,
  Publisher,
  OrderUpdatedEvent,
} from '@sirjhep/ticketing-common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}

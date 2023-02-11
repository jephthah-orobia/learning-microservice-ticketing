import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@sirjhep/ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

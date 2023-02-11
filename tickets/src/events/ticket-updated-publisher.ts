import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@sirjhep/ticketing-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

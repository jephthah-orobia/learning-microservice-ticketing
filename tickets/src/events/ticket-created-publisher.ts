import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@sirjhep/ticketing-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

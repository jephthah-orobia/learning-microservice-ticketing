import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@sirjhep/ticketing-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

import { Publisher, ExpirationCompleteEvent, Subjects } from '@ticx/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

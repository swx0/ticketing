import { AuthCreatedEvent, Publisher, Subjects } from '@ticx/common';

export class AuthCreatedPublisher extends Publisher<AuthCreatedEvent> {
  readonly subject = Subjects.AuthCreated;
}

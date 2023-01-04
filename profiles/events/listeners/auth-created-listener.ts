import { Listener, AuthCreatedEvent, Subjects } from '@ticx/common';
import { Message } from 'node-nats-streaming';
import { Profile } from '../../models/profile';
import { queueGroupName } from './queue-group-name';

export class AuthCreatedListener extends Listener<AuthCreatedEvent> {
  readonly subject = Subjects.AuthCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: AuthCreatedEvent['data'], msg: Message) {
    const profile = Profile.build({
      id: data.id,
    });
    console.log(profile);

    await profile.save();

    msg.ack();
  }
}

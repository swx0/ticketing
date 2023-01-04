import { Listener, AuthCreatedEvent, Subjects } from '@ticx/common';
import { Message } from 'node-nats-streaming';
import { sendgrid } from '../../sendgrid';
import { queueGroupName } from './queue-group-name';
import { Response } from '@sendgrid/helpers/classes';
import { ResponseError } from '@sendgrid/mail/src/mail';
export class AuthCreatedListener extends Listener<AuthCreatedEvent> {
  readonly subject = Subjects.AuthCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: AuthCreatedEvent['data'], msg: Message) {
    // send user created email

    const mail = {
      to: data.email,
      from: process.env.SENDER_EMAIL,
      subject: 'User created successfully',
      text: 'Welcome to ticx!',
    };

    sendgrid
      .send(mail)
      .then((resp: Response) => {
        console.log('Email sent\n');
      })
      .catch((error: ResponseError) => {
        console.error(error);
      });

    msg.ack();
  }
}

import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// 2nd arg represents clientID
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// interupt or terminate processes will trigger stan.close() in order to close down
// This prevents messages from being sent to listeners that are in midst of closing
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

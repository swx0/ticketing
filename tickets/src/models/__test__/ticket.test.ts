import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // save ticket to db
  await ticket.save();

  // fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make 2 separate changes to tickets fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save 1st fetched ticket (will have version number incremented by 1)
  await firstInstance!.save();

  // save 2nd fetched ticket (will have outdated version number) - expect error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('should not reach here');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 232,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0); // version number incremented by 1 upon saving
  await ticket.save();
  expect(ticket.version).toEqual(1); // version number incremented by 1 upon saving
  await ticket.save();
  expect(ticket.version).toEqual(2); // version number incremented by 1 upon saving
});

export const stripe = {
  charges: {
    // returns a promise that resolves to empty object
    create: jest.fn().mockResolvedValue({}),
  },
};

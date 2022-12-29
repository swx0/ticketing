import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signup: (id?: string) => string[];
}

// make use of mock file instead
jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Empty db before each test
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// global function returning a promise
// performing fake auth for testing purposes
// optional args to use specific id
global.signup = (id?: string) => {
  // Build JWT payload { id, email }
  const payload = {
    // randomly generated id
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT }
  const session = { jwt: token };

  // turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with encoded data
  return [`session=${base64}`];
};

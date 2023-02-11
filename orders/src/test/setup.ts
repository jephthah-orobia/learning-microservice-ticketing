import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

let mongo: MongoMemoryServer;

jest.mock('@sirjhep/ticketing-common', () => {
  const orig = jest.requireActual('@sirjhep/ticketing-common');
  return {
    ...orig,
    natsu: {
      client: {
        publish: jest
          .fn()
          .mockImplementation(
            (subject: string, message: string, callback: () => void) => {
              callback();
            }
          ),
      },
    },
  };
});

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const cookieOfSignIn = (
  email: string
): { cookie: string[]; userId: string } => {
  //Build a JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: email,
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. {jwt: MYJWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data. [`session=${base64}`]
  return { cookie: [`session=${base64}`], userId: payload.id };
};

// This file is used to setup the test environment
import { TextEncoder, TextDecoder } from "util";

// Fix for TextEncoder/TextDecoder not being available in Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock MongoDB memory server
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Setup MongoDB Memory Server for testing
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

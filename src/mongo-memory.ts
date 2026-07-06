import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export async function getMemoryMongoUri(): Promise<string> {
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}
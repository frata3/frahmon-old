import mongoose from 'mongoose';

const connections = {};       
const pendingConnections = {};

export async function getConnection(dbKey, mongoUrl) {
  if (connections[dbKey]) return connections[dbKey];
  if (pendingConnections[dbKey]) return await pendingConnections[dbKey];

  const connectionPromise = mongoose.createConnection(mongoUrl).asPromise();
  pendingConnections[dbKey] = connectionPromise;

  const conn = await connectionPromise;
  connections[dbKey] = conn;
  delete pendingConnections[dbKey];

  console.log(`Connected to ${dbKey}`);
  return conn;
}

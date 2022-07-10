import { MongoClient } from 'mongodb'

const uri = process.env.DATA_URI

export async function connectToDatabase() {
  const client = new MongoClient(uri, { useUnifiedTopology: true })
  await client.connect()

  return client
}
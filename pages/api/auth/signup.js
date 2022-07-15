import { hashPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'


async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  const data = req.body
  const { email, password } = data

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    res.status(422).json({ message: 'Invalid input.' })
  }

  const client = await connectToDatabase()
  const db = client.db('auth-demo')

  const result = await db.collection('users').insertOne({
    email: email,
    password: await hashPassword(password),
  })

  res.status(201).json({ message: 'Create user!' })
}

export default handler
import { getSession } from 'next-auth/client'
import { hashPassword, verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'PATCH') return

  const session = await getSession({ req: req })

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    client.close()
    return
  }

  const userEmail = session.user.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const client = await connectToDatabase()
  const usersCollection = client.db('auth-demo').collection('users')
  const user = await usersCollection.findOne({ email: userEmail })

  if (!user) {
    res.status(401).json({ message: 'User not found.' })
    client.close()
    return
  }

  const currentHashedPassword = user.password
  const arePasswordsEqual = await verifyPassword(oldPassword, currentHashedPassword)

  if (!arePasswordsEqual) {
    res.status(403).json({ message: 'Invalid password.' })
    client.close()
    return
  }

  const newHashedPassword = await hashPassword(newPassword)

  await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: newHashedPassword } }
  )

  client.close()
  res.status(200).json({ message: 'Password update!' })
}

export default handler
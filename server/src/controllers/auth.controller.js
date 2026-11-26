import User from "../models/User.js"

export async function register(req, res) {
  const { uid, email } = req.firebaseUser
  if (!email) return res.status(400).json({ message: "A verified email is required" })

  const existing = await User.findOne({ firebaseUid: uid })
  if (existing) return res.status(409).json({ message: "Account already registered" })

  const user = await User.create({ firebaseUid: uid, email, ...req.body })
  res.status(201).json({ user })
}

export function me(req, res) {
  res.json({ user: req.user })
}
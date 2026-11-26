import { firebaseAuth } from "../config/firebase.js"
import User from "../models/User.js"

// 1) Checks the Firebase token only (used by register, before a MongoDB user exists)
export async function verifyToken(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: "Missing login token" })

  try {
    req.firebaseUser = await firebaseAuth.verifyIdToken(token)
    next()
  } catch {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

// 2) Loads the MongoDB user that belongs to the token
export async function loadUser(req, res, next) {
  const user = await User.findOne({ firebaseUid: req.firebaseUser.uid })
  if (!user) return res.status(404).json({ message: "Profile not found. Please register." })
  if (!user.isActive) return res.status(403).json({ message: "Account is disabled" })
  req.user = user
  next()
}

// Use this on every protected route
export const requireAuth = [verifyToken, loadUser]
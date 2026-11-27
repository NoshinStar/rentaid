import { createContext, useContext, useEffect, useRef, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth"
import { auth } from "../firebase"
import { api } from "../services/api"

const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // MongoDB profile, includes the role
  const [fbUser, setFbUser] = useState(null) // Firebase account (may exist without a profile)
  const [loading, setLoading] = useState(true)
  const registering = useRef(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setFbUser(firebaseUser)
      if (registering.current) return
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const data = await api("/auth/me")
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  async function register({ name, phone, email, password, role }) {
    registering.current = true
    let cred
    try {
      cred = await createUserWithEmailAndPassword(auth, email, password)
      const token = await cred.user.getIdToken()
      const data = await api("/auth/register", {
        method: "POST",
        body: { name, phone, role },
        token,
      })
      setUser(data.user)
      return data.user
    } catch (err) {
      if (cred) await deleteUser(cred.user).catch(() => {})
      throw err
    } finally {
      registering.current = false
    }
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
    try {
      const data = await api("/auth/me")
      setUser(data.user)
      return data.user
    } catch (err) {
      await signOut(auth)
      throw err
    }
  }

  // Google: existing profile -> dashboard, new user -> complete-profile page
  async function googleSignIn() {
    const cred = await signInWithPopup(auth, googleProvider)
    try {
      const data = await api("/auth/me", { token: await cred.user.getIdToken() })
      setUser(data.user)
      return { needsProfile: false, user: data.user }
    } catch (err) {
      if (err.status === 404) return { needsProfile: true }
      await signOut(auth)
      throw err
    }
  }

  // Creates the MongoDB profile for a Google user
  async function completeProfile({ name, phone, role }) {
    const data = await api("/auth/register", {
      method: "POST",
      body: { name, phone, role },
    })
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, fbUser, loading, register, login, googleSignIn, completeProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
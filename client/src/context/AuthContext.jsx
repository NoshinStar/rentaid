import { createContext, useContext, useEffect, useRef, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth"
import { auth } from "../firebase"
import { api } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // MongoDB profile, includes the role
  const [loading, setLoading] = useState(true)
  const registering = useRef(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (registering.current) return // register() sets the user itself
      if (!fbUser) {
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
      // avoid a Firebase account without a MongoDB profile
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

  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
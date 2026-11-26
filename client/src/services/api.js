import { auth } from "../firebase"

const BASE = import.meta.env.VITE_API_URL

export async function api(path, { method = "GET", body, token } = {}) {
  const idToken = token ?? (await auth.currentUser?.getIdToken())

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || "Request failed")
    err.errors = data.errors
    err.status = res.status
    throw err
  }
  return data
}
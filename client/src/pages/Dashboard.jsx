import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold">Welcome, {user.name}</h1>
      <p className="mt-2 text-muted">Role: {user.role}</p>
      <button
        onClick={logout}
        className="mt-6 rounded-full bg-brand px-6 py-3 font-semibold text-white"
      >
        Sign out
      </button>
    </div>
  )
}
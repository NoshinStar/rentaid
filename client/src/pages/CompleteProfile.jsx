import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import { useAuth } from "../context/AuthContext"
import { authErrorMessage } from "../utils/authErrors"

const inputCls =
  "h-11 w-full rounded-lg border border-white/80 bg-white/70 px-3 text-sm font-medium text-ink " +
  "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
const labelCls = "mb-1 mt-4 block text-[11px] font-bold uppercase tracking-wide text-ink/80"

const roles = [
  { value: "tenant", title: "Rent a home", sub: "I'm a tenant" },
  { value: "landlord", title: "List a property", sub: "I'm a landlord" },
]

export default function CompleteProfile() {
  const { user, fbUser, loading, completeProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", phone: "", role: "tenant" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading) return
    if (user) navigate("/dashboard", { replace: true })
    else if (!fbUser) navigate("/login", { replace: true })
  }, [user, fbUser, loading, navigate])

  useEffect(() => {
    if (fbUser?.displayName) {
      setForm((f) => (f.name ? f : { ...f, name: fbUser.displayName }))
    }
  }, [fbUser])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await completeProfile(form)
      navigate("/dashboard")
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function useAnotherAccount() {
    await logout()
    navigate("/login")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-bl from-[#241914]/85 via-[#241914]/60 to-[#F5A65B]/30" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[420px] rounded-3xl border border-white/60 bg-[#FFF8EF]/80 p-7 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex justify-center"><Logo size={30} /></div>
        <h1 className="mt-3 text-center font-heading text-2xl font-semibold text-ink">Complete your profile</h1>
        <p className="mt-1 text-center text-sm text-ink/70">
          Signed in as <span className="font-semibold">{fbUser?.email}</span>
        </p>

        <fieldset className="mt-4">
          <legend className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink/80">I want to</legend>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <label key={r.value} className="cursor-pointer">
                <input
                  type="radio" name="role" value={r.value}
                  checked={form.role === r.value} onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="block rounded-lg border border-white/80 bg-white/60 px-2 py-1.5 text-center transition peer-checked:border-brand peer-checked:bg-white peer-checked:ring-2 peer-checked:ring-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                  <span className="block text-sm font-bold text-ink">{r.title}</span>
                  <span className="text-[11px] text-muted">{r.sub}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="name" className={labelCls}>Full name</label>
        <input id="name" name="name" required autoComplete="name" value={form.name}
          onChange={handleChange} placeholder="Your name" className={inputCls} />

        <label htmlFor="phone" className={labelCls}>Phone number</label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel"
          pattern="01[3-9][0-9]{8}" title="Enter an 11-digit number like 01712345678"
          value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className={inputCls} />

        {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 h-11 w-full rounded-full bg-brand text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Continue"}
        </button>

        <button
          type="button"
          onClick={useAnotherAccount}
          className="mt-3 block w-full text-center text-sm font-semibold text-brand"
        >
          Use a different account
        </button>
      </form>
    </div>
  )
}
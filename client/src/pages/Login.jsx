import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const inputBase =
  'h-12 w-full rounded-xl border border-white/80 bg-white/70 pl-11 font-medium text-ink ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand'
const label = 'mb-1.5 mt-5 block text-xs font-bold uppercase tracking-wide text-ink/80'
const iconCls = 'pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-brand'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Login (API will be connected later):', form)
  }

  return (
    <div className="relative flex min-h-screen items-center overflow-hidden">
      {/* Photo background + warm dark overlay */}
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#241914]/85 via-[#241914]/60 to-[#824B39]/50" />

      <Link
        to="/"
        className="absolute left-6 top-6 z-10 font-semibold text-white/90 hover:text-white"
      >
        ← Back to home
      </Link>

      <div className="relative z-10 mx-auto grid w-full max-w-[1100px] items-center gap-12 px-6 py-20 md:grid-cols-2">
        {/* Left: message (hidden on phones) */}
        <div className="hidden text-white md:block">
          <h2 className="font-heading text-5xl leading-[1.1] font-semibold">
            Your next home, <em className="text-[#FFC58A]">verified</em>.
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/90">
            Sign in to manage bookings, agreements and rent in one place.
          </p>
          <ul className="mt-8 space-y-3 font-semibold">
            <li>✓ Landlords checked by an admin</li>
            <li>✓ Digital rental agreements</li>
            <li>✓ Clear dispute resolution</li>
          </ul>
        </div>

        {/* Right: glass card */}
        <div className="relative mx-auto w-full max-w-[440px]">
          {/* Spheres: one behind the card (blurred by the glass), one in front */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFE2C6,#E9784F_60%,#A8462B)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 z-20 size-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFF1D6,#F5A65B_60%,#C9752B)]" />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-[28px] border border-white/60 bg-[#FFF8EF]/75 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
          >
            <div className="flex justify-center">
              <Logo size={38} />
            </div>
            <h1 className="mt-6 text-center font-heading text-3xl font-semibold text-ink">Welcome back</h1>
            <p className="mt-1 text-center text-ink/70">Tenants, landlords and admins sign in here.</p>

            <label htmlFor="email" className={label}>Email address</label>
            <div className="relative">
              <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
              </svg>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" className={`${inputBase} pr-3.5`}
              />
            </div>

            <label htmlFor="password" className={label}>Password</label>
            <div className="relative">
              <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <input
                id="password" name="password" required autoComplete="current-password"
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="Enter your password" className={`${inputBase} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                aria-pressed={showPw}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
                  {showPw && <path d="M3 3l18 18" />}
                </svg>
              </button>
            </div>

            <div className="my-5 flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="accent-[#824B39]" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-brand">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="h-[50px] w-full rounded-full bg-brand text-base font-bold text-white shadow-md transition hover:brightness-110"
            >
              Sign in
            </button>

            <p className="mt-6 border-t border-white/70 pt-5 text-center text-ink/70">
              New to RentAid?{' '}
              <Link to="/register" className="font-bold text-brand">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
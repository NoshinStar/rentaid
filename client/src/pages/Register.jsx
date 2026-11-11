import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const inputBase =
  'h-10 w-full rounded-lg border border-white/80 bg-white/70 pl-9 pr-3 text-sm font-medium text-ink ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand'
const labelCls = 'mb-1 mt-3 block text-[11px] font-bold uppercase tracking-wide text-ink/80'
const iconCls = 'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand'

const icons = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
}

function Field({ id, label, icon, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <div className="relative">
        <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icons[icon]}
        </svg>
        {children}
      </div>
    </div>
  )
}

const roles = [
  { value: 'tenant', title: 'Rent a home', sub: "I'm a tenant" },
  { value: 'landlord', title: 'List a property', sub: "I'm a landlord" },
]

export default function Register() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '', confirm: '', role: 'tenant', terms: false,
  })
  const [showPw, setShowPw] = useState(false)

  const mismatch = form.confirm !== '' && form.password !== form.confirm

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (mismatch) return
    const { confirm, terms, ...data } = form
    console.log('Register (API will be connected later):', data)
  }

  return (
    <div className="relative flex min-h-screen items-center overflow-hidden">
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-bl from-[#241914]/85 via-[#241914]/60 to-[#F5A65B]/30" />

      <Link to="/" className="absolute left-6 top-6 z-10 font-semibold text-white/90 hover:text-white">
        ← Back to home
      </Link>

      <div className="relative z-10 mx-auto grid w-full max-w-[1000px] items-center gap-12 px-6 py-12 md:grid-cols-2">
        {/* Left: compact glass card */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div aria-hidden="true" className="pointer-events-none absolute -left-8 -top-8 size-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFF1D6,#F5A65B_60%,#C9752B)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-6 z-20 size-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFE2C6,#E9784F_60%,#A8462B)]" />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-3xl border border-white/60 bg-[#FFF8EF]/75 p-6 shadow-2xl backdrop-blur-xl sm:p-7"
          >
            <div className="flex justify-center"><Logo size={30} /></div>
            <h1 className="mt-3 text-center font-heading text-2xl font-semibold text-ink">Create your account</h1>

            {/* Role choice */}
            <fieldset className="mt-3">
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

            {/* Name + phone side by side */}
            <div className="grid grid-cols-2 gap-3">
              <Field id="name" label="Full name" icon="user">
                <input id="name" name="name" required autoComplete="name" value={form.name}
                  onChange={handleChange} placeholder="Your name" className={inputBase} />
              </Field>
              <Field id="phone" label="Phone" icon="phone">
                <input id="phone" name="phone" type="tel" required autoComplete="tel"
                  pattern="01[3-9][0-9]{8}" title="Enter an 11-digit number like 01712345678"
                  value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className={inputBase} />
              </Field>
            </div>

            <Field id="email" label="Email address" icon="mail">
              <input id="email" name="email" type="email" required autoComplete="email"
                value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputBase} />
            </Field>

            <Field id="password" label="Password" icon="lock">
              <input id="password" name="password" required minLength={8} autoComplete="new-password"
                type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange}
                placeholder="At least 8 characters" className={`${inputBase} pr-14`} />
              <button
                type="button" onClick={() => setShowPw(!showPw)} aria-pressed={showPw}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </Field>

            <Field id="confirm" label="Confirm password" icon="lock">
              <input id="confirm" name="confirm" required autoComplete="new-password"
                type={showPw ? 'text' : 'password'} value={form.confirm} onChange={handleChange}
                aria-invalid={mismatch} aria-describedby={mismatch ? 'confirm-error' : undefined}
                placeholder="Re-enter your password" className={inputBase} />
            </Field>
            {mismatch && (
              <p id="confirm-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                Passwords do not match.
              </p>
            )}

            <label className="mt-3 flex items-start gap-2 text-xs font-medium text-ink">
              <input type="checkbox" name="terms" required checked={form.terms}
                onChange={handleChange} className="mt-0.5 accent-[#824B39]" />
              <span>I agree to the Terms &amp; Conditions and Privacy Policy</span>
            </label>

            <button type="submit"
              className="mt-4 h-11 w-full rounded-full bg-brand text-sm font-bold text-white shadow-md transition hover:brightness-110">
              Create account
            </button>

            <p className="mt-3 border-t border-white/70 pt-3 text-center text-sm text-ink/70">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand">Sign in</Link>
            </p>
          </form>
        </div>

        {/* Right: message (hidden on phones) */}
        <div className="hidden text-white md:block">
          <h2 className="font-heading text-5xl leading-[1.1] font-semibold">
            Rent with <em className="text-[#FFC58A]">confidence</em>.
          </h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-bold text-[#FFC58A]">For tenants</h3>
              <p className="mt-1 text-white/90">Find verified rentals, request a booking and keep your agreement and rent records in one place.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#FFC58A]">For landlords</h3>
              <p className="mt-1 text-white/90">Get verified, list your property and manage requests and tenants with clear records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
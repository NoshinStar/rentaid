import { useEffect, useRef, useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import Logo from "./Logo"
import { useAuth } from "../context/AuthContext"

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/listings", label: "Listings" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
]

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#824B39] text-sm font-bold text-white shadow-sm ring-2 ring-transparent transition hover:ring-[#C28B70] focus:outline-none focus-visible:ring-[#172033]"
      >
        {initials(user.name)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#EADFD5] bg-white shadow-xl"
        >
          <div className="border-b border-[#EADFD5] px-4 py-3">
            <p className="truncate font-semibold text-[#172033]">{user.name}</p>
            <p className="truncate text-sm text-[#5B6573]">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-[#F3E3D8] px-2 py-0.5 text-xs font-bold capitalize text-[#824B39]">
              {user.role}
            </span>
          </div>

          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-[#293345] hover:bg-[#FFF8EF] hover:text-[#824B39]"
          >
            Dashboard
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="block w-full border-t border-[#EADFD5] px-4 py-3 text-left font-semibold text-[#824B39] hover:bg-[#FFF8EF]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#EADFD5] bg-[#FFF8EF]/95 text-[#172033] shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1248px] flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Logo />

        <nav className="flex flex-wrap items-center gap-6 font-medium">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-[#824B39] pb-1 font-semibold text-[#824B39]"
                  : "border-b-2 border-transparent pb-1 text-[#293345] transition-colors duration-200 hover:border-[#C28B70] hover:text-[#824B39]"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-5 font-medium">
          <button type="button" className="text-[#293345] transition-colors hover:text-[#824B39]">
            EN | বাং
          </button>

          {loading ? null : user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="font-medium text-[#293345] transition-colors hover:text-[#824B39]">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#824B39] px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#693A2C] hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
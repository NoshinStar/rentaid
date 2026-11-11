
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/listings', label: 'Listings' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#EADFD5] bg-[#FFF8EF]/95 text-[#172033] shadow-sm backdrop-blur-md">
      
      <div className="mx-auto flex max-w-[1248px] flex-wrap items-center justify-between gap-3 px-6 py-3">

        {/* Logo */}
        <Logo />

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center gap-6 font-medium">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-[#824B39] pb-1 font-semibold text-[#824B39]'
                  : 'border-b-2 border-transparent pb-1 text-[#293345] transition-colors duration-200 hover:border-[#C28B70] hover:text-[#824B39]'
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Authentication & Language */}
        <div className="flex flex-wrap items-center gap-5 font-medium">

          <button
            type="button"
            className="text-[#293345] transition-colors hover:text-[#824B39]"
          >
            EN | বাং
          </button>

          <Link
            to="/login"
            className="font-medium text-[#293345] transition-colors hover:text-[#824B39]"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-[#824B39] px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#693A2C] hover:shadow-md"
          >
            Sign up
          </Link>

        </div>

      </div>
    </header>
  )
}


import { Link } from 'react-router-dom'

export default function Logo({ size = 36 }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">

      {/* House Icon */}
      <span
        className="flex shrink-0 items-center justify-center rounded-xl bg-[#824B39] shadow-sm"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.62}
          height={size * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFF8EF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-7h6v7" />
          <path d="M7.5 11.5h2" />
          <path d="M14.5 11.5h2" />
        </svg>
      </span>

      {/* Brand Name */}
      <span className="font-heading text-2xl font-extrabold tracking-tight text-[#172033]">
        Rent<span className="text-[#824B39]">Aid</span>
      </span>

    </Link>
  )
}

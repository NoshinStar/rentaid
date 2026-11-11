
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden">

      {/* Background Image */}
      <img
        src="/images/hero.jpg"
        alt="Beautiful modern family home"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#241914]/85 via-[#241914]/55 to-[#241914]/10" />

      {/* Hero Content */}
      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-20 text-white">

        <span className="inline-block rounded-full bg-[#FFF8EF] px-4 py-2 text-[13px] font-semibold text-[#824B39]">
          Verified rentals · Chattogram
        </span>

        <h1 className="my-5 max-w-[700px] font-heading text-5xl leading-[1.1] font-semibold md:text-[64px]">
          Find a verified home in{' '}
          <em className="text-[#FFC58A]">Chattogram</em>
        </h1>

        <p className="max-w-[540px] text-base leading-relaxed text-white/90 md:text-lg">
          Bachelor flats, sublets and single rooms from checked landlords,
          with digital agreements and a clear way to settle disputes.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/listings"
            className="rounded-full bg-[#F5A65B] px-8 py-4 font-bold text-[#291B15] transition hover:bg-[#FFC17D] hover:shadow-lg"
          >
            Browse rentals
          </Link>

          <Link
            to="/register"
            className="rounded-full border-2 border-white/90 px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#824B39]"
          >
            I'm a landlord
          </Link>

        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-white">
          <li>✓ Verified landlords</li>
          <li>✓ Digital agreements</li>
          <li>✓ Rent reminders</li>
        </ul>

      </div>
    </section>
  )
}

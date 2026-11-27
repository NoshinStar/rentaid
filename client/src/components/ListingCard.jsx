import { Link } from 'react-router-dom'
import { roomTypeLabel, taka } from '../utils/format'

export default function ListingCard({ listing }) {
  const image = listing.images?.[0]?.url

  return (
    <Link
      to={`/listings/${listing._id}`}
      className='block h-full overflow-hidden rounded-2xl border border-[#EADFD5] bg-white shadow-sm transition hover:shadow-md'
    >
      {image ? (
        <img src={image} alt={listing.title} loading='lazy' className='h-44 w-full object-cover' />
      ) : (
        <div className='h-44 w-full bg-gradient-to-br from-[#E9C9B8] to-[#C28B70]' />
      )}
      <div className='p-4'>
        <span className='rounded-full bg-[#F3E3D8] px-3 py-1 text-xs font-bold text-brand'>
          {roomTypeLabel(listing.roomType)}
        </span>
        <h3 className='mt-2 line-clamp-1 font-heading text-lg font-semibold'>{listing.title}</h3>
        <p className='text-sm text-muted'>{listing.area}</p>
        <p className='mt-2 font-heading text-xl font-semibold'>
          {taka(listing.rent)} <span className='font-sans text-sm font-normal text-muted'>/ month</span>
        </p>
      </div>
    </Link>
  )
}
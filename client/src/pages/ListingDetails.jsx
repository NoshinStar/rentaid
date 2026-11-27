import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { roomTypeLabel, taka, errorMessage } from '../utils/format'

const inputCls = 'w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2 text-sm'
const labelCls = 'mb-1 mt-4 block text-xs font-bold uppercase tracking-wide text-muted'

export default function ListingDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ moveInDate: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    api(`/listings/${id}`)
      .then((data) => setListing(data.listing))
      .catch(() => setListing(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleBook(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api('/bookings', { method: 'POST', body: { listingId: id, ...form } })
      toast.success('Request sent to the landlord')
      navigate('/my-bookings')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

  if (!listing) {
    return (
      <div className='mx-auto max-w-[600px] px-6 py-20 text-center'>
        <h1 className='font-heading text-3xl font-semibold'>Listing not found</h1>
        <Link to='/listings' className='mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white'>
          Back to listings
        </Link>
      </div>
    )
  }

  const image = listing.images?.[0]?.url

  return (
    <div className='mx-auto grid max-w-[1100px] gap-10 px-6 py-10 lg:grid-cols-[1fr_340px]'>
      <div>
        {image ? (
          <img src={image} alt={listing.title} className='h-72 w-full rounded-2xl object-cover sm:h-96' />
        ) : (
          <div className='h-72 w-full rounded-2xl bg-gradient-to-br from-[#E9C9B8] to-[#C28B70] sm:h-96' />
        )}

        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <span className='rounded-full bg-[#F3E3D8] px-3 py-1 text-xs font-bold text-brand'>
            {roomTypeLabel(listing.roomType)}
          </span>
          <StatusBadge status={listing.status} />
        </div>
        <h1 className='mt-3 font-heading text-3xl font-semibold'>{listing.title}</h1>
        <p className='mt-1 text-muted'>{listing.address}</p>

        <dl className='mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-[#EADFD5] bg-white p-5 sm:grid-cols-4'>
          <div><dt className='text-xs font-bold uppercase text-muted'>Rent</dt><dd className='font-semibold'>{taka(listing.rent)}</dd></div>
          <div><dt className='text-xs font-bold uppercase text-muted'>Deposit</dt><dd className='font-semibold'>{taka(listing.deposit || 0)}</dd></div>
          <div><dt className='text-xs font-bold uppercase text-muted'>Bedrooms</dt><dd className='font-semibold'>{listing.bedrooms}</dd></div>
          <div><dt className='text-xs font-bold uppercase text-muted'>Bathrooms</dt><dd className='font-semibold'>{listing.bathrooms}</dd></div>
        </dl>

        <h2 className='mt-8 font-heading text-xl font-semibold'>About this place</h2>
        <p className='mt-2 whitespace-pre-line text-muted'>{listing.description}</p>

        {listing.amenities?.length > 0 && (
          <>
            <h2 className='mt-8 font-heading text-xl font-semibold'>Amenities</h2>
            <ul className='mt-2 flex flex-wrap gap-2'>
              {listing.amenities.map((a) => (
                <li key={a} className='rounded-full bg-white px-3 py-1 text-sm ring-1 ring-[#EADFD5]'>{a}</li>
              ))}
            </ul>
          </>
        )}

        <p className='mt-8 text-sm text-muted'>Listed by {listing.landlord?.name}</p>
      </div>

      {/* Booking panel */}
      <aside className='h-fit rounded-2xl border border-[#EADFD5] bg-white p-5 lg:sticky lg:top-24'>
        <p className='font-heading text-2xl font-semibold'>
          {taka(listing.rent)} <span className='font-sans text-sm font-normal text-muted'>/ month</span>
        </p>

        {!user ? (
          <div className='mt-4'>
            <p className='text-muted'>Sign in as a tenant to send a request.</p>
            <Link to='/login' className='mt-4 block rounded-full bg-brand py-3 text-center font-semibold text-white'>
              Sign in
            </Link>
          </div>
        ) : user.role !== 'tenant' ? (
          <p className='mt-4 text-muted'>Only tenants can send rental requests.</p>
        ) : listing.status !== 'active' ? (
          <p className='mt-4 text-muted'>This place is not available right now.</p>
        ) : (
          <form onSubmit={handleBook}>
            <label htmlFor='moveInDate' className={labelCls}>Move-in date</label>
            <input id='moveInDate' type='date' required min={today} value={form.moveInDate}
              onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} className={`${inputCls} h-11`} />

            <label htmlFor='message' className={labelCls}>Message (optional)</label>
            <textarea id='message' rows={3} maxLength={500} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder='Tell the landlord a little about yourself' className={inputCls} />

            <button type='submit' disabled={submitting}
              className='mt-5 h-11 w-full rounded-full bg-brand font-semibold text-white disabled:opacity-60'>
              {submitting ? 'Sending...' : 'Send request'}
            </button>
          </form>
        )}
      </aside>
    </div>
  )
}
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { taka, formatDate, errorMessage } from '../utils/format'

export default function Requests() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/bookings/requests')
      .then((data) => setBookings(data.bookings))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function respond(id, action) {
    try {
      const { booking } = await api(`/bookings/${id}/${action}`, { method: 'PATCH' })
      setBookings((list) => list.map((b) => (b._id === id ? { ...b, status: booking.status } : b)))
      toast.success(action === 'accept' ? 'Request accepted' : 'Request rejected')
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  return (
    <div className='mx-auto max-w-[1100px] px-6 py-10'>
      <h1 className='font-heading text-3xl font-semibold'>Booking requests</h1>

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <div className='mt-10 rounded-2xl border border-dashed border-[#D9CFC4] p-10 text-center'>
          <p className='font-heading text-2xl font-semibold'>No requests yet</p>
          <p className='mt-2 text-muted'>When a tenant requests one of your listings, it appears here.</p>
        </div>
      ) : (
        <ul className='mt-8 space-y-4'>
          {bookings.map((b) => (
            <li key={b._id} className='rounded-2xl border border-[#EADFD5] bg-white p-5'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                  <p className='font-heading text-lg font-semibold'>{b.listing?.title || 'Listing removed'}</p>
                  <p className='text-sm text-muted'>
                    {b.listing && `${b.listing.area} · ${taka(b.listing.rent)} / month`}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className='mt-4 grid gap-2 text-sm sm:grid-cols-2'>
                <p><span className='font-semibold'>Tenant:</span> {b.tenant?.name}</p>
                <p><span className='font-semibold'>Phone:</span> {b.tenant?.phone}</p>
                <p><span className='font-semibold'>Email:</span> {b.tenant?.email}</p>
                <p><span className='font-semibold'>Move-in:</span> {formatDate(b.moveInDate)}</p>
              </div>
              {b.message && <p className='mt-3 rounded-lg bg-[#FFF8EF] p-3 text-sm'>{b.message}</p>}

              {b.status === 'pending' && (
                <div className='mt-4 flex gap-3'>
                  <button onClick={() => respond(b._id, 'accept')} className='rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white'>
                    Accept
                  </button>
                  <button onClick={() => respond(b._id, 'reject')} className='rounded-full border border-red-700 px-5 py-2 text-sm font-semibold text-red-700'>
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
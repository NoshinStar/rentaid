import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import ConfirmModal from '../components/ConfirmModal'
import { taka, formatDate, errorMessage } from '../utils/format'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(null) // { booking, action: 'cancel' | 'delete' }

  useEffect(() => {
    api('/bookings/mine')
      .then((data) => setBookings(data.bookings))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function confirm() {
    const { booking, action } = pending
    try {
      if (action === 'cancel') {
        const { booking: updated } = await api(`/bookings/${booking._id}/cancel`, { method: 'PATCH' })
        setBookings((list) => list.map((b) => (b._id === booking._id ? { ...b, status: updated.status } : b)))
        toast.success('Request cancelled')
      } else {
        await api(`/bookings/${booking._id}`, { method: 'DELETE' })
        setBookings((list) => list.filter((b) => b._id !== booking._id))
        toast.success('Booking removed')
      }
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setPending(null)
    }
  }

  return (
    <div className='mx-auto max-w-[1100px] px-6 py-10'>
      <h1 className='font-heading text-3xl font-semibold'>My bookings</h1>

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <div className='mt-10 rounded-2xl border border-dashed border-[#D9CFC4] p-10 text-center'>
          <p className='font-heading text-2xl font-semibold'>No requests yet</p>
          <p className='mt-2 text-muted'>Find a place you like and send a rental request.</p>
          <Link to='/listings' className='mt-5 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white'>
            Browse listings
          </Link>
        </div>
      ) : (
        <ul className='mt-8 space-y-4'>
          {bookings.map((b) => (
            <li key={b._id} className='rounded-2xl border border-[#EADFD5] bg-white p-5'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                  {b.listing ? (
                    <Link to={`/listings/${b.listing._id}`} className='font-heading text-lg font-semibold hover:text-brand'>
                      {b.listing.title}
                    </Link>
                  ) : (
                    <p className='font-heading text-lg font-semibold'>Listing removed</p>
                  )}
                  <p className='text-sm text-muted'>
                    {b.listing && `${b.listing.area} · ${taka(b.listing.rent)} / month`}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <p className='mt-3 text-sm'>
                <span className='font-semibold'>Move-in:</span> {formatDate(b.moveInDate)}
                {b.landlord?.name && <> · <span className='font-semibold'>Landlord:</span> {b.landlord.name}</>}
              </p>
              {b.message && <p className='mt-3 rounded-lg bg-[#FFF8EF] p-3 text-sm'>{b.message}</p>}

              {b.status === 'pending' && (
                <button onClick={() => setPending({ booking: b, action: 'cancel' })}
                  className='mt-4 rounded-full border border-red-700 px-5 py-2 text-sm font-semibold text-red-700'>
                  Cancel request
                </button>
              )}
              {(b.status === 'cancelled' || b.status === 'rejected') && (
                <button onClick={() => setPending({ booking: b, action: 'delete' })}
                  className='mt-4 rounded-full border border-[#D9CFC4] px-5 py-2 text-sm font-semibold'>
                  Remove from list
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(pending)}
        title={pending?.action === 'cancel' ? 'Cancel this request?' : 'Remove this booking?'}
        message={pending?.action === 'cancel' ? 'The landlord will no longer see it as pending.' : 'It will disappear from your list.'}
        confirmText={pending?.action === 'cancel' ? 'Cancel request' : 'Remove'}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
    </div>
  )
}
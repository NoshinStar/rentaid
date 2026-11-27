import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import ConfirmModal from '../components/ConfirmModal'
import { taka, errorMessage } from '../utils/format'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    api('/listings/mine')
      .then((data) => setListings(data.listings))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function confirmDelete() {
    try {
      await api(`/listings/${toDelete._id}`, { method: 'DELETE' })
      setListings((list) => list.filter((l) => l._id !== toDelete._id))
      toast.success('Listing deleted')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setToDelete(null)
    }
  }

  return (
    <div className='mx-auto max-w-[1100px] px-6 py-10'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='font-heading text-3xl font-semibold'>My listings</h1>
        <Link to='/listings/new' className='rounded-full bg-brand px-6 py-3 font-semibold text-white'>
          Add listing
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : listings.length === 0 ? (
        <div className='mt-10 rounded-2xl border border-dashed border-[#D9CFC4] p-10 text-center'>
          <p className='font-heading text-2xl font-semibold'>No listings yet</p>
          <p className='mt-2 text-muted'>Add your first place so tenants can find it.</p>
          <Link to='/listings/new' className='mt-5 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white'>
            Add listing
          </Link>
        </div>
      ) : (
        <ul className='mt-8 space-y-4'>
          {listings.map((l) => (
            <li key={l._id} className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EADFD5] bg-white p-5'>
              <div>
                <Link to={`/listings/${l._id}`} className='font-heading text-lg font-semibold hover:text-brand'>
                  {l.title}
                </Link>
                <p className='text-sm text-muted'>{l.area} · {taka(l.rent)} / month</p>
              </div>
              <div className='flex items-center gap-3'>
                <StatusBadge status={l.status} />
                <Link to={`/listings/${l._id}/edit`} className='rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand'>
                  Edit
                </Link>
                <button onClick={() => setToDelete(l)} className='rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white'>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title='Delete this listing?'
        message={`"${toDelete?.title}" will be removed for good.`}
        confirmText='Delete'
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
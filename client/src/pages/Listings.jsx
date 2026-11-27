import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import ListingCard from '../components/ListingCard'
import Spinner from '../components/Spinner'
import { roomTypes, errorMessage } from '../utils/format'

const empty = { q: '', roomType: '', maxRent: '' }
const inputCls = 'h-11 w-full rounded-lg border border-[#D9CFC4] bg-white px-3 text-sm'
const labelCls = 'mb-1 block text-xs font-bold uppercase tracking-wide text-muted'

export default function Listings() {
  const [filters, setFilters] = useState(empty)
  const [applied, setApplied] = useState(empty)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({ limit: '24' })
    Object.entries(applied).forEach(([key, value]) => value && params.set(key, value))

    api(`/listings?${params}`)
      .then((data) => setListings(data.listings))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [applied])

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setApplied(filters)
  }

  function clearFilters() {
    setFilters(empty)
    setApplied(empty)
  }

  return (
    <div className='mx-auto max-w-[1100px] px-6 py-10'>
      <h1 className='font-heading text-4xl font-semibold'>Rentals in Chattogram</h1>

      <form
        onSubmit={handleSubmit}
        className='mt-6 grid gap-4 rounded-2xl border border-[#EADFD5] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end'
      >
        <div>
          <label htmlFor='q' className={labelCls}>Search</label>
          <input id='q' name='q' value={filters.q} onChange={handleChange}
            placeholder='Area or keyword' className={inputCls} />
        </div>
        <div>
          <label htmlFor='roomType' className={labelCls}>Room type</label>
          <select id='roomType' name='roomType' value={filters.roomType} onChange={handleChange} className={inputCls}>
            <option value=''>Any type</option>
            {roomTypes.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='maxRent' className={labelCls}>Max rent (৳)</label>
          <input id='maxRent' name='maxRent' type='number' min='0' value={filters.maxRent}
            onChange={handleChange} placeholder='e.g. 15000' className={inputCls} />
        </div>
        <button type='submit' className='h-11 rounded-full bg-brand font-semibold text-white'>
          Search
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : listings.length === 0 ? (
        <div className='mt-10 rounded-2xl border border-dashed border-[#D9CFC4] p-10 text-center'>
          <p className='font-heading text-2xl font-semibold'>No rentals found</p>
          <p className='mt-2 text-muted'>Try a different search or remove some filters.</p>
          <button onClick={clearFilters} className='mt-5 rounded-full bg-brand px-6 py-3 font-semibold text-white'>
            Clear filters
          </button>
        </div>
      ) : (
        <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}
    </div>
  )
}
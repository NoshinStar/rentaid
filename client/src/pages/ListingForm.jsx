import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import Spinner from '../components/Spinner'
import { roomTypes, errorMessage } from '../utils/format'

const inputCls = 'h-11 w-full rounded-lg border border-[#D9CFC4] bg-white px-3 text-sm'
const labelCls = 'mb-1 mt-4 block text-xs font-bold uppercase tracking-wide text-muted'

const emptyForm = {
  title: '', description: '', area: '', address: '', roomType: 'bachelor_flat',
  rent: '', deposit: '', bedrooms: '1', bathrooms: '1', sizeSqft: '',
  furnished: false, amenities: '', imageUrl: '', status: 'active',
}

function Field({ label, name, form, onChange, ...props }) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>{label}</label>
      <input id={name} name={name} value={form[name]} onChange={onChange} className={inputCls} {...props} />
    </div>
  )
}

export default function ListingForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api('/listings/mine')
      .then(({ listings }) => {
        const l = listings.find((x) => x._id === id)
        if (!l) {
          toast.error('Listing not found')
          navigate('/my-listings')
          return
        }
        setForm({
          title: l.title, description: l.description, area: l.area, address: l.address,
          roomType: l.roomType, rent: String(l.rent), deposit: String(l.deposit ?? ''),
          bedrooms: String(l.bedrooms ?? ''), bathrooms: String(l.bathrooms ?? ''),
          sizeSqft: l.sizeSqft ? String(l.sizeSqft) : '',
          furnished: l.furnished, amenities: (l.amenities || []).join(', '),
          imageUrl: l.images?.[0]?.url || '', status: l.status,
        })
      })
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, isEdit, navigate])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: form.title,
      description: form.description,
      area: form.area,
      address: form.address,
      roomType: form.roomType,
      rent: Number(form.rent),
      deposit: form.deposit === '' ? 0 : Number(form.deposit),
      bedrooms: form.bedrooms === '' ? 1 : Number(form.bedrooms),
      bathrooms: form.bathrooms === '' ? 1 : Number(form.bathrooms),
      furnished: form.furnished,
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      images: form.imageUrl.trim() ? [{ url: form.imageUrl.trim() }] : [],
      status: form.status,
    }
    if (form.sizeSqft) payload.sizeSqft = Number(form.sizeSqft)

    try {
      await api(isEdit ? `/listings/${id}` : '/listings', {
        method: isEdit ? 'PATCH' : 'POST',
        body: payload,
      })
      toast.success(isEdit ? 'Listing updated' : 'Listing added')
      navigate('/my-listings')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className='mx-auto max-w-[700px] px-6 py-10'>
      <h1 className='font-heading text-3xl font-semibold'>{isEdit ? 'Edit listing' : 'Add a listing'}</h1>

      <form onSubmit={handleSubmit} className='mt-6 rounded-2xl border border-[#EADFD5] bg-white p-6'>
        <Field label='Title' name='title' form={form} onChange={handleChange} required minLength={5} maxLength={120} />

        <label htmlFor='description' className={labelCls}>Description</label>
        <textarea id='description' name='description' rows={4} required minLength={20} maxLength={2000}
          value={form.description} onChange={handleChange}
          className='w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2 text-sm' />

        <div className='grid gap-x-4 sm:grid-cols-2'>
          <Field label='Area' name='area' form={form} onChange={handleChange} required placeholder='e.g. GEC Circle' />
          <div>
            <label htmlFor='roomType' className={labelCls}>Room type</label>
            <select id='roomType' name='roomType' value={form.roomType} onChange={handleChange} className={inputCls}>
              {roomTypes.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <Field label='Address' name='address' form={form} onChange={handleChange} required minLength={5} />

        <div className='grid gap-x-4 sm:grid-cols-2'>
          <Field label='Monthly rent (৳)' name='rent' type='number' min='500' form={form} onChange={handleChange} required />
          <Field label='Deposit (৳)' name='deposit' type='number' min='0' form={form} onChange={handleChange} />
          <Field label='Bedrooms' name='bedrooms' type='number' min='0' max='10' form={form} onChange={handleChange} />
          <Field label='Bathrooms' name='bathrooms' type='number' min='0' max='10' form={form} onChange={handleChange} />
          <Field label='Size (sqft)' name='sizeSqft' type='number' min='50' form={form} onChange={handleChange} />
          <div>
            <label htmlFor='status' className={labelCls}>Status</label>
            <select id='status' name='status' value={form.status} onChange={handleChange} className={inputCls}>
              <option value='draft'>Draft (hidden)</option>
              <option value='active'>Active (visible)</option>
              <option value='rented'>Rented</option>
              <option value='archived'>Archived (hidden)</option>
            </select>
          </div>
        </div>

        <Field label='Amenities (separate with commas)' name='amenities' form={form}
          onChange={handleChange} placeholder='Lift, Gas, Wi-Fi' />
        <Field label='Image URL' name='imageUrl' type='url' form={form}
          onChange={handleChange} placeholder='https://...' />

        <label className='mt-4 flex items-center gap-2 text-sm font-medium'>
          <input type='checkbox' name='furnished' checked={form.furnished} onChange={handleChange} className='accent-[#824B39]' />
          Furnished
        </label>

        <button type='submit' disabled={saving}
          className='mt-6 h-11 w-full rounded-full bg-brand font-semibold text-white disabled:opacity-60'>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add listing'}
        </button>
      </form>
    </div>
  )
}
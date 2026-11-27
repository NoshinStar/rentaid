import mongoose from 'mongoose'
import Listing from '../models/Listing.js'

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const str = (v) => (typeof v === 'string' ? v.trim() : '')
const num = (v) => {
  if (typeof v !== 'string' || v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const sorts = {
  newest: { createdAt: -1 },
  rent_asc: { rent: 1 },
  rent_desc: { rent: -1 },
}

// Public: active listings with filters, search, sorting and paging
export async function getListings(req, res) {
  const area = str(req.query.area)
  const roomType = str(req.query.roomType)
  const q = str(req.query.q)
  const minRent = num(req.query.minRent)
  const maxRent = num(req.query.maxRent)
  const bedrooms = num(req.query.bedrooms)
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50)
  const sortKey = str(req.query.sort)
  const sort = Object.hasOwn(sorts, sortKey) ? sorts[sortKey] : sorts.newest

  const filter = { status: 'active' }
  if (area) filter.area = area
  if (roomType) filter.roomType = roomType
  if (minRent !== null || maxRent !== null) {
    filter.rent = {}
    if (minRent !== null) filter.rent.$gte = minRent
    if (maxRent !== null) filter.rent.$lte = maxRent
  }
  if (bedrooms !== null) filter.bedrooms = { $gte: bedrooms }
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i')
    filter.$or = [{ title: rx }, { area: rx }, { address: rx }]
  }

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('landlord', 'name')
      .lean(),
    Listing.countDocuments(filter),
  ])

  res.json({ listings, page, limit, total, pages: Math.ceil(total / limit) })
}

// Public: one listing (not drafts or archived)
export async function getListing(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Listing not found' })

  const listing = await Listing.findOne({ _id: id, status: { $in: ['active', 'rented'] } })
    .populate('landlord', 'name')
    .lean()
  if (!listing) return res.status(404).json({ message: 'Listing not found' })

  res.json({ listing })
}

// Landlord: all of my own listings, every status
export async function getMyListings(req, res) {
  const listings = await Listing.find({ landlord: req.user._id }).sort({ createdAt: -1 }).lean()
  res.json({ listings })
}

export async function createListing(req, res) {
  const listing = await Listing.create({ ...req.body, landlord: req.user._id })
  res.status(201).json({ listing })
}

// Finds a listing and makes sure it belongs to the signed-in landlord
async function findOwnListing(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Listing not found' })
    return null
  }
  const listing = await Listing.findById(id)
  if (!listing) {
    res.status(404).json({ message: 'Listing not found' })
    return null
  }
  if (!listing.landlord.equals(req.user._id)) {
    res.status(403).json({ message: 'You can only change your own listings' })
    return null
  }
  return listing
}

export async function updateListing(req, res) {
  const listing = await findOwnListing(req, res)
  if (!listing) return

  Object.assign(listing, req.body)
  await listing.save()
  res.json({ listing })
}

export async function deleteListing(req, res) {
  const listing = await findOwnListing(req, res)
  if (!listing) return

  await listing.deleteOne()
  res.json({ message: 'Listing deleted' })
}
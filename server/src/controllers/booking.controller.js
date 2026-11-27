import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Listing from '../models/Listing.js'

// Tenant: send a request for a listing
export async function createBooking(req, res) {
  const { listingId, moveInDate, message } = req.body

  const listing = await Listing.findById(listingId)
  if (!listing || listing.status !== 'active') {
    return res.status(404).json({ message: 'This listing is not available' })
  }

  const existing = await Booking.findOne({
    listing: listing._id,
    tenant: req.user._id,
    status: { $in: ['pending', 'accepted'] },
  })
  if (existing) {
    return res.status(409).json({ message: 'You already have a request for this listing' })
  }

  const booking = await Booking.create({
    listing: listing._id,
    tenant: req.user._id,
    landlord: listing.landlord,
    moveInDate,
    message,
  })
  res.status(201).json({ booking })
}

// Tenant: my requests
export async function getMyBookings(req, res) {
  const bookings = await Booking.find({ tenant: req.user._id })
    .sort({ createdAt: -1 })
    .populate('listing', 'title area rent roomType images')
    .populate('landlord', 'name')
    .lean()
  res.json({ bookings })
}

// Landlord: requests for my listings
export async function getRequests(req, res) {
  const bookings = await Booking.find({ landlord: req.user._id })
    .sort({ createdAt: -1 })
    .populate('listing', 'title area rent')
    .populate('tenant', 'name phone email')
    .lean()
  res.json({ bookings })
}

async function loadBooking(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Booking not found' })
    return null
  }
  const booking = await Booking.findById(id)
  if (!booking) {
    res.status(404).json({ message: 'Booking not found' })
    return null
  }
  return booking
}

// One small function builds accept, reject and cancel
function changeStatus({ owner, newStatus }) {
  return async (req, res) => {
    const booking = await loadBooking(req, res)
    if (!booking) return

    if (!booking[owner].equals(req.user._id)) {
      return res.status(403).json({ message: 'You cannot change this booking' })
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be changed' })
    }

    booking.status = newStatus
    await booking.save()
    res.json({ booking })
  }
}

export const acceptBooking = changeStatus({ owner: 'landlord', newStatus: 'accepted' })
export const rejectBooking = changeStatus({ owner: 'landlord', newStatus: 'rejected' })
export const cancelBooking = changeStatus({ owner: 'tenant', newStatus: 'cancelled' })

// Tenant: remove a cancelled or rejected request from my list
export async function deleteBooking(req, res) {
  const booking = await loadBooking(req, res)
  if (!booking) return

  if (!booking.tenant.equals(req.user._id)) {
    return res.status(403).json({ message: 'You cannot delete this booking' })
  }
  if (!['cancelled', 'rejected'].includes(booking.status)) {
    return res.status(400).json({ message: 'Cancel the request before deleting it' })
  }

  await booking.deleteOne()
  res.json({ message: 'Booking deleted' })
}
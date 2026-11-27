import { Router } from 'express'
import { requireAuth } from '../middlewares/verifyToken.js'
import { requireRole } from '../middlewares/requireRole.js'
import { validate } from '../middlewares/validate.js'
import { createBookingSchema } from '../validators/booking.validator.js'
import {
  createBooking,
  getMyBookings,
  getRequests,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  deleteBooking,
} from '../controllers/booking.controller.js'

const router = Router()

router.post('/', requireAuth, requireRole('tenant'), validate(createBookingSchema), createBooking)
router.get('/mine', requireAuth, requireRole('tenant'), getMyBookings)
router.get('/requests', requireAuth, requireRole('landlord'), getRequests)

router.patch('/:id/accept', requireAuth, requireRole('landlord'), acceptBooking)
router.patch('/:id/reject', requireAuth, requireRole('landlord'), rejectBooking)
router.patch('/:id/cancel', requireAuth, requireRole('tenant'), cancelBooking)

router.delete('/:id', requireAuth, requireRole('tenant'), deleteBooking)

export default router
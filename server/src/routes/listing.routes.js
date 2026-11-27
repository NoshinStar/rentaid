import { Router } from 'express'
import { requireAuth } from '../middlewares/verifyToken.js'
import { requireRole } from '../middlewares/requireRole.js'
import { validate } from '../middlewares/validate.js'
import { createListingSchema, updateListingSchema } from '../validators/listing.validator.js'
import {
  getListings,
  getListing,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listing.controller.js'

const router = Router()

router.get('/', getListings)
router.get('/mine', requireAuth, requireRole('landlord'), getMyListings) // before '/:id'
router.get('/:id', getListing)

router.post('/', requireAuth, requireRole('landlord'), validate(createListingSchema), createListing)
router.patch('/:id', requireAuth, requireRole('landlord'), validate(updateListingSchema), updateListing)
router.delete('/:id', requireAuth, requireRole('landlord'), deleteListing)

export default router
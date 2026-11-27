import { z } from 'zod'

export const createBookingSchema = z.object({
  listingId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid listing'),
  moveInDate: z.coerce.date({ message: 'Choose a move-in date' }).refine(
    (d) => d >= new Date(new Date().setHours(0, 0, 0, 0)),
    'Move-in date cannot be in the past'
  ),
  message: z.string().trim().max(500, 'Message is too long').optional(),
})
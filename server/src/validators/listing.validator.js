import { z } from 'zod'

const fields = z.object({
  title: z.string().trim().min(5, 'Title is too short').max(120),
  description: z.string().trim().min(20, 'Description is too short').max(2000),
  area: z.string().trim().min(2).max(60),
  address: z.string().trim().min(5).max(200),
  roomType: z.enum(['bachelor_flat', 'single_room', 'sublet'], { message: 'Invalid room type' }),
  rent: z.number().int().min(500, 'Rent is too low').max(1000000),
  deposit: z.number().int().min(0).max(5000000).optional(),
  bedrooms: z.number().int().min(0).max(10).optional(),
  bathrooms: z.number().int().min(0).max(10).optional(),
  sizeSqft: z.number().int().min(50).max(20000).optional(),
  furnished: z.boolean().optional(),
  amenities: z.array(z.string().trim().min(1).max(40)).max(15).optional(),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string().optional() }))
    .max(8)
    .optional(),
  status: z.enum(['draft', 'active', 'rented', 'archived']).optional(),
})

export const createListingSchema = fields
export const updateListingSchema = fields.partial()
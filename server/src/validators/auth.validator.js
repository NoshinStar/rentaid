import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),
  phone: z.string().trim().regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladesh phone number"),
  role: z.enum(["tenant", "landlord"], { message: "Role must be tenant or landlord" }),
})
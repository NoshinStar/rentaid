import { Router } from "express"
import { register, me } from "../controllers/auth.controller.js"
import { verifyToken, requireAuth } from "../middlewares/verifyToken.js"
import { validate } from "../middlewares/validate.js"
import { registerSchema } from "../validators/auth.validator.js"

const router = Router()

router.post("/register", verifyToken, validate(registerSchema), register)
router.get("/me", requireAuth, me)

export default router
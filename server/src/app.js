import express from "express"
import cors from "cors"
import helmet from "helmet"
import authRoutes from "./routes/auth.routes.js"
import listingRoutes from './routes/listing.routes.js'
import bookingRoutes from './routes/booking.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use('/api/v1/listings', listingRoutes)
app.use('/api/v1/bookings', bookingRoutes)

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", message: "RentAid API is running" })
})

app.use("/api/v1/auth", authRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: "This record already exists" })
  }
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || "Server error" })
})

export default app
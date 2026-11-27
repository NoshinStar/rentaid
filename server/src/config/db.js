import dns from 'node:dns'
import mongoose from 'mongoose'

// Local fix for networks where the default DNS cannot find Atlas
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
}

let connection = null

export function connectDB() {
  if (!connection) {
    connection = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => {
        connection = null // try again on the next request
        throw err
      })
  }
  return connection
}
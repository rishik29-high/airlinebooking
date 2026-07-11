import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import flightRoutes from './routes/flight-routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003

// Allow requests from the Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
}))

app.use(express.json())

// Mount flight routes
app.use('/flights', flightRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'AirService', port: PORT })
})

app.listen(PORT, () => {
  console.log(`AirService running on port ${PORT}`)
})

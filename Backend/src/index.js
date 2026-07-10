import express from 'express'
import { PORT } from './Configuration/config.js'
import { connectToMongoDB } from './Connections/connectToDB.js'
import userRoute from './Routers/user-router.js'

// Create an Express application
const app = express()

// These two lines let Express understand JSON and form data from requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to the local MongoDB database named "airline-booking"
connectToMongoDB('mongodb://localhost:27017/airline-booking')

// All API routes live under the "/api" prefix (e.g. /api/signup, /api/signin)
app.use('/api', userRoute)

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
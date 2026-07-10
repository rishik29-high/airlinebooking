import express from 'express'
import {PORT} from './Configuration/config.js'
import {connectToMongoDB} from './Connections/connectToDB.js'
import userRoute from './Routers/user-router.js'

const app=express()

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB with database name "airline-booking"
connectToMongoDB('mongodb://localhost:27017/airline-booking')

app.use('/api',userRoute)


app.listen(PORT, ()=>console.log('Backend Server started at Port '+PORT))
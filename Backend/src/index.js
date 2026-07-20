import express from 'express'
import { PORT } from './Configuration/config.js'
import { connectToMongoDB } from './Connections/connectToDB.js'
import userRoute from './Routers/user-router.js'

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', userRoute)

const startServer = async () => {
  await connectToMongoDB('mongodb://localhost:27017/airline-booking')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

startServer()
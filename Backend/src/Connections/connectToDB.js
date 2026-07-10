import mongoose from 'mongoose'

/**
 * Connects to a MongoDB database using the provided URL.
 * Example URL: 'mongodb://localhost:27017/airline-booking'
 */
async function connectToMongoDB(url) {
    try {
        await mongoose.connect(url)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message)
        process.exit(1)  // Stop the server if the database connection fails
    }
}

export { connectToMongoDB }
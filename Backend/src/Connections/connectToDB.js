import mongoose from 'mongoose'

async function connectToMongoDB(url) {
    try {
        await mongoose.connect(url)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message)
        process.exit(1)
    }
}

export { connectToMongoDB }
import mongoose from 'mongoose'

async function connectToMongoDB(url){
    return await mongoose.connect(url)
        .then(()=>{console.log("mongoDB connected successfully");
        })
        .catch(()=>console.log('Error occured while connecting to MongoDB'))
}

export{
    connectToMongoDB
}
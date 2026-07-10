import {users} from '../Models/users-model.js'

class userRepository{
    async create(data){
        try {
            const user = await users.create(data)
            return user
        } catch (error) {
            console.log("something went wrong in the user-repo layer: ",error)
            throw error;
        }
    }

}

export{
    userRepository
}
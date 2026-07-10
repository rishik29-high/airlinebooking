import {userRepository} from '../Repository/user-repo.js'

class userService{
    constructor(){
        this.userRepository=new userRepository()
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data)
            return user
        } catch (error) {
            console.log('something went wrong in the user service layer');
            throw error;
        }
    }
}


export{
    userService
}
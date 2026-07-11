import { User } from '../Models/users-model.js'

class UserRepository {

  async create(data) {
    try {
      const user = await User.create(data)
      return user
    } catch (error) {
      throw error
    }
  }

  async getByEmail(email) {
    try {
      const user = await User.findOne({ email })
      return user
    } catch (error) {
      throw error
    }
  }
}

export { UserRepository }
import { User } from '../Models/users-model.js'

/**
 * UserRepository — handles all direct database operations for users.
 * This is the only layer that talks to MongoDB.
 */
class UserRepository {

  /** Create a new user in the database */
  async create(data) {
    try {
      const user = await User.create(data)
      return user
    } catch (error) {
      throw error
    }
  }

  /** Find a user by their email address */
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
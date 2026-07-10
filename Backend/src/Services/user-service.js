import { UserRepository } from '../Repository/user-repo.js'
import bcrypt from 'bcrypt'

/**
 * UserService — contains all the business logic for user operations.
 * It sits between the Controller (which handles HTTP) and the Repository (which handles the database).
 */
class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  /** Register a new user — the password hashing happens automatically in the User model */
  async signUp(data) {
    const user = await this.userRepository.create(data)
    return user
  }

  /** Authenticate a user by email and password */
  async signIn(email, password) {
    // Step 1: Find the user by email
    const user = await this.userRepository.getByEmail(email)
    if (!user) {
      throw { error: 'No account found with this email' }
    }

    // Step 2: Compare the plain-text password with the hashed one in the database
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw { error: 'Incorrect password' }
    }

    // Step 3: Return the user (controller will generate the JWT token)
    return user
  }
}

export { UserService }
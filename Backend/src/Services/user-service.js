import { UserRepository } from '../Repository/user-repo.js'
import bcrypt from 'bcrypt'

// Service layer sits between the Controller (which handles HTTP) and the Repository (which handles the database).

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async signUp(data) {
    const user = await this.userRepository.create(data)
    return user
  }

  async signIn(email, password) {
    const user = await this.userRepository.getByEmail(email)
    if (!user) {
      throw { error: 'No account found with this email' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw { error: 'Incorrect password' }
    }

    return user
  }
}

export { UserService }
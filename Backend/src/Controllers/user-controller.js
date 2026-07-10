import { UserService } from '../Services/user-service.js'
import jwt from 'jsonwebtoken'

const JWT_KEY = 'secret'
const userService = new UserService()

/**
 * POST /api/signup
 * Creates a new user account.
 */
const signUp = async (req, res) => {
  try {
    const user = await userService.signUp({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    })

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        fullname: user.fullname,
        email: user.email,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message || error,
    })
  }
}

/**
 * POST /api/signin
 * Authenticates a user and returns a JWT token.
 */
const signIn = async (req, res) => {
  try {
    const user = await userService.signIn(req.body.email, req.body.password)

    // Generate a JWT token that expires in 1 day
    const token = jwt.sign(
      { id: user._id, email: user.email, fullname: user.fullname },
      JWT_KEY,
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      data: {
        fullname: user.fullname,
        email: user.email,
        token,
      },
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      error: error.message || error,
    })
  }
}

export { signUp, signIn }

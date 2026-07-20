import express from 'express'
import { signUp, signIn } from '../Controllers/user-controller.js'
import { authMiddleware } from '../Middlewares/auth-middleware.js'

const router = express.Router()

// Public routes (no token needed)
router.post('/signup', signUp)
router.post('/signin', signIn)

// Protected routes (token required) 
router.get('/home', authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the home page',
    data: { user: req.user },
  })
})

export default router

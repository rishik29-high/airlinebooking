import jwt from 'jsonwebtoken'

const JWT_KEY = 'secret'

const authMiddleware = (req, res, next) => {
  // Step 1: Get the Authorization header
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied — no token provided',
    })
  }

  // Step 2: Check the format is "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Access denied — token format must be: Bearer <token>',
    })
  }

  // Step 3: Verify the token
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, JWT_KEY)
    req.user = decoded  // Attach user info (id, email, fullname) to the request
    next()              
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied — token is invalid or expired',
    })
  }
}

export { authMiddleware }

import { useState } from 'react'
import axios from 'axios'
import './SignIn.css'

/**
 * SignIn — the login form component.
 *
 * Props:
 *   onNavigateToSignUp — function to switch to the signup page
 *   onSignInSuccess    — function called with the JWT token after a successful login
 */
function SignIn({ onNavigateToSignUp, onSignInSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setErrorMessage('')  // Clear any previous error

    try {
      const response = await axios.post('/api/signin', { email, password })
      const data = response.data

      if (data.success) {
        // Save the token and set it as the default header for future requests
        const token = data.data.token
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Clear the form and navigate to home
        setEmail('')
        setPassword('')
        onSignInSuccess(token)
      } else {
        setErrorMessage('Invalid email or password')
      }
    } catch {
      setErrorMessage('Invalid email or password')
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">Welcome Back</h2>
          <p className="signup-subtitle">Sign in to access your flight bookings</p>
        </div>

        <form onSubmit={handleSignIn} className="signup-form">
          {errorMessage && (
            <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', margin: '0 0 1rem' }}>
              {errorMessage}
            </p>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Sign In
          </button>

          <div className="form-footer">
            Don't have an account?{' '}
            <a
              href="#"
              className="form-footer-link"
              onClick={(e) => {
                e.preventDefault()
                onNavigateToSignUp()
              }}
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn

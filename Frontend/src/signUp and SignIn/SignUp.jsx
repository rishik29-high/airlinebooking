import { useState } from 'react'
import axios from 'axios'
import './SignUp.css'

/**
 * SignUp — the registration form component.
 *
 * Props:
 *   onNavigateToSignIn — function to switch to the sign-in page
 */
function SignUp({ onNavigateToSignIn }) {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await axios.post('/api/signup', {
        fullname,
        email,
        password,
      })

      if (response.data.success) {
        // Show success and clear the form
        setIsError(false)
        setMessage('Account created! You can now sign in.')
        setFullname('')
        setEmail('')
        setPassword('')
      } else {
        setIsError(true)
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setIsError(true)
      setMessage('Could not create account. Email may already be in use.')
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Sign up to access flight bookings</p>
        </div>

        <form onSubmit={handleCreateUser} className="signup-form">
          {message && (
            <p style={{
              color: isError ? '#ef4444' : '#4ade80',
              fontSize: '0.9rem',
              textAlign: 'center',
              margin: '0 0 1rem',
            }}>
              {message}
            </p>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

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
            Sign Up
          </button>

          <div className="form-footer">
            Already have an account?{' '}
            <a
              href="#"
              className="form-footer-link"
              onClick={(e) => {
                e.preventDefault()
                onNavigateToSignIn()
              }}
            >
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp

import { useState, useEffect } from 'react'
import axios from 'axios'
import SignUp from './signUp and SignIn/SignUp'
import SignIn from './signUp and SignIn/SignIn'
import Home from './Home'

/**
 * App — the root component that controls which page the user sees.
 *
 * Page routing works like this:
 *   - 'signup'  → show the registration form
 *   - 'signin'  → show the login form
 *   - 'home'    → show the protected dashboard (requires a valid token)
 *
 * On startup, we check if the user already has a valid token saved.
 * If yes, we skip the login screen and go straight to the dashboard.
 */
function App() {
  const [page, setPage] = useState('signin')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, check if the user is already logged in
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token')

      // No token saved? Go to the sign-in page
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Try calling the protected /api/home endpoint with the saved token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get('/api/home')

        if (response.data.success) {
          setUser(response.data.data.user)
          setPage('home')
        } else {
          clearAuth()
        }
      } catch {
        // Token is invalid or expired — clear it and show login
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  /** Called after a successful sign-in — fetches user data and shows the dashboard */
  const handleSignInSuccess = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get('/api/home')

      if (response.data.success) {
        setUser(response.data.data.user)
      }
    } catch {
      // Even if fetching user data fails, still show the home page
    }
    setPage('home')
  }

  /** Logs the user out — clears token, resets state, and goes to login */
  const handleLogout = () => {
    clearAuth()
  }

  /** Helper to remove the token and reset state */
  const clearAuth = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setPage('signin')
  }

  // Navigation helpers
  const navigateToSignIn = () => setPage('signin')
  const navigateToSignUp = () => setPage('signup')

  // Show a loading screen while we check the token
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'sans-serif',
      }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  // Render the correct page based on state
  if (page === 'home') {
    return <Home user={user} onLogout={handleLogout} />
  }

  if (page === 'signin') {
    return <SignIn onNavigateToSignUp={navigateToSignUp} onSignInSuccess={handleSignInSuccess} />
  }

  return <SignUp onNavigateToSignIn={navigateToSignIn} />
}

export default App

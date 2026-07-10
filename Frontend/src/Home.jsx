import './Home.css'

/**
 * Home — the protected dashboard page (only visible to logged-in users).
 *
 * Props:
 *   user     — object with the logged-in user's info (fullname, email)
 *   onLogout — function to sign the user out
 */
function Home({ user, onLogout }) {
  /** Returns a greeting based on the current time of day */
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Sample flight data for the dashboard (will be replaced with real API data later)
  const flights = [
    {
      id: 'f1',
      number: 'AB-402',
      airline: 'SkyGlide Airways',
      from: 'JFK',
      fromCity: 'New York',
      to: 'LHR',
      toCity: 'London',
      duration: '7h 15m',
      status: 'On Time',
      gate: 'B18',
      boardingTime: '08:45 AM',
      seat: '12A (Business)',
    },
    {
      id: 'f2',
      number: 'SG-981',
      airline: 'Pacific Wings',
      from: 'LAX',
      fromCity: 'Los Angeles',
      to: 'HND',
      toCity: 'Tokyo',
      duration: '11h 30m',
      status: 'Boarding soon',
      gate: 'G04',
      boardingTime: '02:15 PM',
      seat: '24K (Economy Plus)',
    },
  ]

  return (
    <div className="home-dashboard">
      {/* ──── Top Navigation Bar ──── */}
      <header className="dashboard-header">
        <div className="brand-container">
          <div className="brand-logo">AeroBook</div>
          <span className="brand-badge">Premium Pass</span>
        </div>

        <div className="user-profile-menu">
          <div className="user-details">
            <div className="user-name">{user?.fullname || 'Traveler'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* ──── Main Content ──── */}
      <main className="dashboard-content">

        {/* Welcome Banner */}
        <section className="welcome-hero">
          <div className="hero-text">
            <h1 className="hero-title">
              {getGreeting()}, <br />
              <span>{user?.fullname || 'Valued Guest'}</span>
            </h1>
            <p className="hero-description">
              Welcome back to your personalized flight companion. Explore,
              organize, and manage your luxury global travels seamlessly.
            </p>
          </div>
        </section>

        {/* Two-column layout: flights on the left, sidebar on the right */}
        <div className="dashboard-grid">

          {/* ── Flight Cards ── */}
          <div className="flights-section">
            <h2 className="section-title">Your Scheduled Flights</h2>
            <div className="flights-list">
              {flights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-info-row">
                    <span className="flight-number">{flight.number}</span>
                    <span className="flight-badge">{flight.status}</span>
                  </div>

                  <div className="flight-route-display">
                    <div className="route-node">
                      <div className="node-code">{flight.from}</div>
                      <div className="node-name">{flight.fromCity}</div>
                    </div>
                    <div className="route-path-line">
                      <div className="path-dot"></div>
                      <div className="path-line"></div>
                      <span className="path-duration">{flight.duration}</span>
                    </div>
                    <div className="route-node">
                      <div className="node-code">{flight.to}</div>
                      <div className="node-name">{flight.toCity}</div>
                    </div>
                  </div>

                  <div className="flight-details-row">
                    <div>
                      <div className="detail-label">Gate</div>
                      <div className="detail-value">{flight.gate}</div>
                    </div>
                    <div>
                      <div className="detail-label">Boarding Time</div>
                      <div className="detail-value">{flight.boardingTime}</div>
                    </div>
                    <div>
                      <div className="detail-label">Seat</div>
                      <div className="detail-value">{flight.seat}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="sidebar-container">
            <div className="stats-card">
              <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '1.2rem' }}>
                Membership
              </h2>
              <div className="stat-item">
                <div className="stat-info">
                  <span className="stat-title">Loyalty Points</span>
                  <span className="stat-subtitle">Frequent Flyer Program</span>
                </div>
                <span className="stat-value highlight">48,250 pts</span>
              </div>
              <div className="stat-item">
                <div className="stat-info">
                  <span className="stat-title">Active Bookings</span>
                  <span className="stat-subtitle">Next 30 Days</span>
                </div>
                <span className="stat-value">2 Flights</span>
              </div>
            </div>

            <div className="action-banner">
              <span className="action-title">Need to fly somewhere?</span>
              <p className="action-text">
                Book flights directly, pick your favorite premium seat, and
                customize meal choices with AeroBook concierge services.
              </p>
              <button className="action-btn">Find Flights</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

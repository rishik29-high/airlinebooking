import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Home.css'

function Home({ user, onLogout }) {
  // ── City autocomplete state ──
  const [fromText, setFromText] = useState('')
  const [fromCode, setFromCode] = useState('')
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [showFromDropdown, setShowFromDropdown] = useState(false)

  const [toText, setToText] = useState('')
  const [toCode, setToCode] = useState('')
  const [toSuggestions, setToSuggestions] = useState([])
  const [showToDropdown, setShowToDropdown] = useState(false)

  const [departureDate, setDepartureDate] = useState('')

  // ── Flight search state ──
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [searchError, setSearchError] = useState('')

  // Refs for click-outside detection
  const fromRef = useRef(null)
  const toRef = useRef(null)

  // ── Debounced autocomplete fetcher ──
  useEffect(() => {
    if (fromText.length < 2) { setFromSuggestions([]); return }
    const timer = setTimeout(() => fetchAutocomplete(fromText, setFromSuggestions, setShowFromDropdown), 300)
    return () => clearTimeout(timer)
  }, [fromText])

  useEffect(() => {
    if (toText.length < 2) { setToSuggestions([]); return }
    const timer = setTimeout(() => fetchAutocomplete(toText, setToSuggestions, setShowToDropdown), 300)
    return () => clearTimeout(timer)
  }, [toText])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setShowFromDropdown(false)
      if (toRef.current && !toRef.current.contains(e.target)) setShowToDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /** Call the AirService autocomplete endpoint */
  const fetchAutocomplete = async (query, setSuggestions, setShowDropdown) => {
    try {
      const res = await axios.get('/flights/autocomplete', { params: { q: query } })
      setSuggestions(res.data.suggestions || [])
      setShowDropdown(true)
      setSearchError('')
    } catch (err) {
      setSuggestions([])
      const msg = err.response?.data?.details || err.response?.data?.error || 'Failed to fetch suggestions'
      setSearchError(`Autocomplete Error: ${msg}`)
    }
  }

  /** Select a suggestion from the From dropdown */
  const selectFrom = (suggestion) => {
    setFromText(suggestion.display)
    setFromCode(suggestion.code)
    setShowFromDropdown(false)
  }

  /** Select a suggestion from the To dropdown */
  const selectTo = (suggestion) => {
    setToText(suggestion.display)
    setToCode(suggestion.code)
    setShowToDropdown(false)
  }

  /** Swap the From and To fields */
  const handleSwap = () => {
    const tmpText = fromText
    const tmpCode = fromCode
    setFromText(toText)
    setFromCode(toCode)
    setToText(tmpText)
    setToCode(tmpCode)
  }

  /** Format minutes into "Xh Ym" */
  const formatDuration = (mins) => {
    if (!mins) return ''
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m > 0 ? m + 'm' : ''}`
  }

  /** Search real flights via the AirService */
  const handleSearch = async () => {
    if (!fromCode || !toCode) {
      setSearchError('Please select a city from the dropdown suggestions for both From and To.')
      return
    }
    if (!departureDate) {
      setSearchError('Please select a departure date.')
      return
    }

    setSearchError('')
    setIsSearching(true)
    setSearchResults(null)

    try {
      const res = await axios.get('/flights/search', {
        params: {
          departure_id: fromCode,
          arrival_id: toCode,
          outbound_date: departureDate,
        },
      })

      const allFlights = [
        ...(res.data.best_flights || []),
        ...(res.data.other_flights || []),
      ]

      setSearchResults(allFlights)
    } catch (err) {
      const msg = err.response?.data?.details || err.response?.data?.error || 'Failed to search flights. Make sure AirService is running.'
      setSearchError(msg)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="home-container">
      {/* ──── Header ──── */}
      <header className="skyfinder-header">
        <div className="logo-section">
          <div className="logo-circle">
            <svg viewBox="0 0 24 24" className="logo-plane-icon">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l7 2.5z" />
            </svg>
          </div>
          <span className="logo-text">
            <span className="logo-sky">Sky</span>
            <span className="logo-finder">Finder</span>
          </span>
        </div>

        <div className="header-right">
          <div className="user-profile">
            <div className="avatar-circle">
              <svg viewBox="0 0 24 24" className="avatar-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="user-email">{user?.email || 'rishik.majhi@iiitranchi.ac.in'}</span>
          </div>
          <div className="header-divider"></div>
          <button className="logout-btn" onClick={onLogout}>
            <svg viewBox="0 0 24 24" className="logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* ──── Hero Section ──── */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Next Flight</h1>
          <p className="hero-subtitle">
            Search hundreds of airlines and book the best flights at the best prices.
          </p>
        </div>
      </section>

      {/* ──── Search Card Overlay ──── */}
      <div className="search-card-wrapper">
        <div className="search-card">
          <div className="search-grid">
            {/* From */}
            <div className="search-field" ref={fromRef}>
              <label className="field-label">From</label>
              <div className="input-with-icon">
                <svg className="field-icon text-blue" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="Source City"
                  value={fromText}
                  onChange={(e) => {
                    setFromText(e.target.value)
                    setFromCode('')
                  }}
                  onFocus={() => { if (fromSuggestions.length) setShowFromDropdown(true) }}
                  className="input-element"
                  autoComplete="off"
                />
              </div>
              {showFromDropdown && fromSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {fromSuggestions.map((s, i) => (
                    <div
                      key={i}
                      className="autocomplete-item"
                      onMouseDown={() => selectFrom(s)}
                    >
                      <svg className="dropdown-pin-icon" viewBox="0 0 24 24">
                        {s.type === 'airport'
                          ? <><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l7 2.5z" /></>
                          : <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>
                        }
                      </svg>
                      <div className="autocomplete-text">
                        <span className="autocomplete-name">{s.display}</span>
                        <span className="autocomplete-type">{s.type === 'airport' ? 'Airport' : 'City'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <span className="helper-text">e.g. Delhi (DEL)</span>
            </div>

            {/* Swap Button */}
            <div className="swap-wrapper">
              <button className="swap-btn" onClick={handleSwap} type="button" aria-label="Swap Cities">
                <svg className="swap-arrow-icon" viewBox="0 0 24 24">
                  <path d="M20 17H4M4 17l4 4M4 17l4-4M4 7h16M20 7l-4 4M20 7l-4-4" />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="search-field" ref={toRef}>
              <label className="field-label">To</label>
              <div className="input-with-icon">
                <svg className="field-icon text-blue" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="Destination City"
                  value={toText}
                  onChange={(e) => {
                    setToText(e.target.value)
                    setToCode('')
                  }}
                  onFocus={() => { if (toSuggestions.length) setShowToDropdown(true) }}
                  className="input-element"
                  autoComplete="off"
                />
              </div>
              {showToDropdown && toSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {toSuggestions.map((s, i) => (
                    <div
                      key={i}
                      className="autocomplete-item"
                      onMouseDown={() => selectTo(s)}
                    >
                      <svg className="dropdown-pin-icon" viewBox="0 0 24 24">
                        {s.type === 'airport'
                          ? <><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l7 2.5z" /></>
                          : <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>
                        }
                      </svg>
                      <div className="autocomplete-text">
                        <span className="autocomplete-name">{s.display}</span>
                        <span className="autocomplete-type">{s.type === 'airport' ? 'Airport' : 'City'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <span className="helper-text">e.g. Mumbai (BOM)</span>
            </div>

            {/* Departure Date */}
            <div className="search-field">
              <label className="field-label">Departure Date</label>
              <div className="input-with-icon">
                <svg className="field-icon text-blue" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type="date"
                  placeholder="Select Date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="input-element"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <span className="helper-text">e.g. 20 Jul 2025</span>
            </div>
          </div>

          {/* Error message */}
          {searchError && (
            <p className="search-error-message">{searchError}</p>
          )}

          <div className="search-button-wrapper">
            <button className="search-flights-btn" onClick={handleSearch} disabled={isSearching}>
              <svg className="search-btn-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {isSearching ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </div>
      </div>

      {/* ──── Loading Spinner ──── */}
      {isSearching && (
        <div className="search-results-loading">
          <div className="spinner"></div>
          <p>Finding the best flights for you...</p>
        </div>
      )}

      {/* ──── Flight Results ──── */}
      {searchResults && (
        <section className="search-results-section">
          <div className="results-container">
            <h2 className="results-title">
              {searchResults.length > 0
                ? `${searchResults.length} Flights Found`
                : 'No Flights Found'}
            </h2>

            {searchResults.length === 0 && (
              <div className="no-results">
                <svg className="no-results-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <p>No flights found for this route and date. Try a different date or city.</p>
              </div>
            )}

            <div className="results-list">
              {searchResults.map((flight) => (
                <div key={flight.id} className={`result-card ${flight.category === 'best' ? 'best-flight-card' : ''}`}>
                  {flight.category === 'best' && (
                    <div className="best-badge">Best</div>
                  )}

                  <div className="airline-info">
                    {flight.airlineLogo ? (
                      <img
                        src={flight.airlineLogo}
                        alt={flight.airline}
                        className="airline-logo-img"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span className="airline-logo">✈️</span>
                    )}
                    <div>
                      <h4 className="airline-name">{flight.airline}</h4>
                      <span className="flight-id-tag">{flight.flightNumber}</span>
                    </div>
                  </div>

                  <div className="route-details">
                    <div className="time-node">
                      <span className="time">
                        {flight.departureTime
                          ? new Date(`2000-01-01T${flight.departureTime.includes('T') ? flight.departureTime.split('T')[1] : flight.departureTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                          : flight.departureTime}
                      </span>
                      <span className="airport">{flight.departureCode}</span>
                    </div>

                    <div className="duration-bar">
                      <span className="duration-label">{formatDuration(flight.totalDuration)}</span>
                      <div className="flight-line">
                        <div className="plane-dot"></div>
                      </div>
                      <span className={`stops-label ${flight.stops === 0 ? 'nonstop' : ''}`}>
                        {flight.stops === 0
                          ? 'Nonstop'
                          : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.stopDetails.length ? ' · ' + flight.stopDetails.join(', ') : ''}`}
                      </span>
                    </div>

                    <div className="time-node">
                      <span className="time">
                        {flight.arrivalTime
                          ? new Date(`2000-01-01T${flight.arrivalTime.includes('T') ? flight.arrivalTime.split('T')[1] : flight.arrivalTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                          : flight.arrivalTime}
                      </span>
                      <span className="airport">{flight.arrivalCode}</span>
                    </div>
                  </div>

                  <div className="price-book">
                    <span className="price-value">
                      {flight.price ? `$${flight.price}` : '—'}
                    </span>
                    <button className="book-btn">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──── Why Choose SkyFinder ──── */}
      <section className="why-choose-section">
        <h2 className="why-choose-title">Why Choose SkyFinder?</h2>
        <div className="title-accent-line"></div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-item">
            <div className="feature-icon-circle blue-light-bg">
              <svg className="feature-icon" viewBox="0 0 24 24">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
              </svg>
              <div className="dollar-badge">$</div>
            </div>
            <h3 className="feature-item-title">Best Prices</h3>
            <p className="feature-item-desc">
              We compare prices from hundreds of airlines to get you the best deals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-item">
            <div className="feature-icon-circle blue-light-bg">
              <svg className="feature-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="feature-item-title">Real-time Updates</h3>
            <p className="feature-item-desc">
              Get real-time updates on flight schedules and prices.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-item">
            <div className="feature-icon-circle blue-light-bg">
              <svg className="feature-icon" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 11 11 13 15 9" />
              </svg>
            </div>
            <h3 className="feature-item-title">Safe Booking</h3>
            <p className="feature-item-desc">
              Book with confidence using our secure and trusted platform.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-item">
            <div className="feature-icon-circle blue-light-bg">
              <svg className="feature-icon" viewBox="0 0 24 24">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              <div className="support-badge">24/7</div>
            </div>
            <h3 className="feature-item-title">24/7 Support</h3>
            <p className="feature-item-desc">
              Our support team is here to help you anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="skyfinder-footer">
        <p>Created by <span className="author-name">Rishik Majhi</span></p>
      </footer>
    </div>
  )
}

export default Home

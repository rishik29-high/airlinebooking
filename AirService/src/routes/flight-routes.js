import express from 'express'
import axios from 'axios'

const router = express.Router()

const SERPAPI_BASE = 'https://serpapi.com/search.json'

/**
 * GET /flights/autocomplete?q=Del
 *
 * Returns city/airport suggestions for the flight search inputs.
 * Each suggestion includes a name and an IATA code (if available).
 */
router.get('/autocomplete', async (req, res) => {
  const { q } = req.query

  if (!q || q.trim().length < 2) {
    return res.json({ suggestions: [] })
  }

  try {
    const response = await axios.get(SERPAPI_BASE, {
      params: {
        engine: 'google_flights_autocomplete',
        q: q.trim(),
        api_key: process.env.SERPAPI_KEY,
      },
    })

    // SerpAPI returns a flat 'suggestions' array
    const serpSuggestions = response.data.suggestions || []

    // Normalize into a flat list for the frontend
    const suggestions = []

    for (const item of serpSuggestions) {
      // If it's a city with nested airports, add the city itself
      if (item.type === 'city') {
        suggestions.push({
          type: 'city',
          name: item.name || '',
          code: item.id || '', // kgmid
          display: item.name,
        })
        
        // And add its specific airports
        if (item.airports && Array.isArray(item.airports)) {
          for (const apt of item.airports) {
            suggestions.push({
              type: 'airport',
              name: apt.name || '',
              code: apt.id || '', // IATA
              display: `${apt.city} (${apt.id}) — ${apt.name}`,
            })
          }
        }
      } 
      // If it's just a top-level airport or region
      else if (item.id && !item.type || item.type === 'airport') {
        suggestions.push({
          type: 'airport',
          name: item.name || '',
          code: item.id || '', // Usually a kgmid for top-level airports without a city parent
          display: item.name,
        })
      }
    }

    return res.json({ suggestions })
  } catch (error) {
    console.error('Autocomplete error:', error.response?.data || error.message)
    return res.status(500).json({
      error: 'Failed to fetch autocomplete suggestions',
      details: error.response?.data?.error || error.message,
    })
  }
})

/**
 * GET /flights/search?departure_id=DEL&arrival_id=BOM&outbound_date=2025-07-20
 *
 * Searches for one-way flights using the SerpAPI Google Flights engine.
 * Returns best_flights and other_flights arrays.
 */
router.get('/search', async (req, res) => {
  const { departure_id, arrival_id, outbound_date } = req.query

  if (!departure_id || !arrival_id || !outbound_date) {
    return res.status(400).json({
      error: 'Missing required parameters: departure_id, arrival_id, outbound_date',
    })
  }

  try {
    const response = await axios.get(SERPAPI_BASE, {
      params: {
        engine: 'google_flights',
        departure_id,
        arrival_id,
        outbound_date,
        type: '2',        // 2 = one-way
        currency: 'USD',
        hl: 'en',
        api_key: process.env.SERPAPI_KEY,
      },
    })

    const bestFlights = response.data.best_flights || []
    const otherFlights = response.data.other_flights || []
    const priceInsights = response.data.price_insights || null

    // Flatten the nested flight segments into a simpler structure
    const formatFlights = (flightsArr, category) => {
      return flightsArr.map((flightGroup, index) => {
        const segments = flightGroup.flights || []
        const firstSeg = segments[0] || {}
        const lastSeg = segments[segments.length - 1] || {}

        return {
          id: `${category}-${index}`,
          // Airline info
          airline: firstSeg.airline || 'Unknown Airline',
          airlineLogo: firstSeg.airline_logo || '',
          flightNumber: firstSeg.flight_number || '',
          // Route info
          departureAirport: firstSeg.departure_airport?.name || '',
          departureCode: firstSeg.departure_airport?.id || '',
          departureTime: firstSeg.departure_airport?.time || '',
          arrivalAirport: lastSeg.arrival_airport?.name || '',
          arrivalCode: lastSeg.arrival_airport?.id || '',
          arrivalTime: lastSeg.arrival_airport?.time || '',
          // Trip details
          totalDuration: flightGroup.total_duration || 0,
          stops: segments.length - 1,
          stopDetails: segments.length > 1
            ? segments.slice(0, -1).map(s => s.arrival_airport?.id).filter(Boolean)
            : [],
          // Price
          price: flightGroup.price || null,
          // Class
          travelClass: firstSeg.travel_class || 'Economy',
          // Airplane
          airplane: firstSeg.airplane || '',
          // Extensions (Wi-Fi, Power, etc.)
          extensions: flightGroup.extensions || [],
          // All segments for detailed view
          segments: segments.map(seg => ({
            airline: seg.airline || '',
            airlineLogo: seg.airline_logo || '',
            flightNumber: seg.flight_number || '',
            departureAirport: seg.departure_airport?.name || '',
            departureCode: seg.departure_airport?.id || '',
            departureTime: seg.departure_airport?.time || '',
            arrivalAirport: seg.arrival_airport?.name || '',
            arrivalCode: seg.arrival_airport?.id || '',
            arrivalTime: seg.arrival_airport?.time || '',
            duration: seg.duration || 0,
            airplane: seg.airplane || '',
            travelClass: seg.travel_class || 'Economy',
          })),
          category,
        }
      })
    }

    const best = formatFlights(bestFlights, 'best')
    const other = formatFlights(otherFlights, 'other')

    return res.json({
      best_flights: best,
      other_flights: other,
      price_insights: priceInsights,
      total: best.length + other.length,
    })
  } catch (error) {
    console.error('Flight search error:', error.response?.data || error.message)
    return res.status(500).json({
      error: 'Failed to search flights',
      details: error.response?.data?.error || error.message,
    })
  }
})

export default router

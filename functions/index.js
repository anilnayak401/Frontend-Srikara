const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { onRequest } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const crypto = require('crypto')

// Initialize Admin SDK to interact with Firestore
initializeApp()
const db = getFirestore()

/**
 * Cloud Function triggered when a patient adds a new appointment.
 * Automatically forwards details to the hospital's CRM API.
 */
exports.syncAppointmentToCRM = onDocumentCreated('appointments/{appointmentId}', async (event) => {
  const appointmentData = event.data.data()
  const crmUrl = process.env.CRM_API_URL // Set via Firebase secrets
  const crmApiKey = process.env.CRM_API_KEY // Set via Firebase secrets

  if (!crmUrl) {
    logger.error('CRM_API_URL environment variable is not configured. Bypassing sync.')
    return
  }

  logger.info(`New appointment captured: ${event.params.appointmentId}. Attempting CRM integration...`)

  try {
    // Make API request to CRM using Node's native fetch
    const response = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${crmApiKey || ''}`
      },
      body: JSON.stringify({
        lead_name: appointmentData.name,
        lead_phone: appointmentData.phone,
        lead_email: appointmentData.email || '',
        referred_doctor: appointmentData.doctor || '',
        hospital_branch: appointmentData.branch || '',
        scheduled_slot: appointmentData.slot || '',
        submission_timestamp: new Date(appointmentData.timestamp || Date.now()).toISOString(),
        website_reference_id: event.params.appointmentId
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`CRM API HTTP Error ${response.status}: ${errorText}`)
    }

    logger.info(`Successfully synced appointment ${event.params.appointmentId} to CRM.`)
  } catch (error) {
    logger.error(`CRM sync error for appointment ${event.params.appointmentId}:`, error.message)
  }
})

/**
 * HTTP Cloud Function to expose booking (appointment) data to CRM and CMS.
 * Secured via SHA-256 hashed API Keys stored in Firestore.
 */
exports.getBookings = onRequest({ cors: true }, async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed. Only GET requests are supported.' })
  }

  // 1. Authenticate the request via API Key
  const authHeader = req.headers['authorization']
  let apiKey = req.headers['x-api-key']

  // Support Bearer token format in Authorization header
  if (!apiKey && authHeader && authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7)
  }

  if (!apiKey) {
    logger.warn('Unauthorized request attempt: Missing API key.')
    return res.status(401).json({ error: 'Unauthorized: Missing API Key' })
  }

  // Compute the SHA-256 hash of the provided API key
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

  try {
    // Query the database for this hashed API key
    const keyDoc = await db.collection('api_keys').doc(hashedKey).get()
    
    if (!keyDoc.exists) {
      logger.warn('Unauthorized request attempt: Invalid API key.')
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' })
    }

    const keyData = keyDoc.data()
    
    // Check if the API key is active
    if (keyData.status !== 'active') {
      logger.warn(`Unauthorized request attempt: Inactive API key for client: ${keyData.client_name}`)
      return res.status(401).json({ error: 'Unauthorized: Inactive API Key' })
    }

    // Verify client has read:bookings permission scope
    const scopes = keyData.scopes || []
    if (!scopes.includes('read:bookings')) {
      logger.warn(`Forbidden request attempt: Insufficient scopes for client: ${keyData.client_name}`)
      return res.status(403).json({ error: 'Forbidden: Insufficient scopes' })
    }

    // 2. Fetch booking data with pagination and filters
    const { branch, limit = 100, startAfter } = req.query

    // Validate limit parameter (cap at 500)
    let limitVal = parseInt(limit, 10)
    if (isNaN(limitVal) || limitVal <= 0) {
      limitVal = 100
    } else if (limitVal > 500) {
      limitVal = 500
    }

    // Build the query
    let query = db.collection('appointments')
      .orderBy('timestamp', 'desc')
      .limit(limitVal)

    // Filter by hospital branch if query parameter provided
    if (branch) {
      query = query.where('branch', '==', branch)
    }

    // Handle pagination using Firestore document cursor
    if (startAfter) {
      const cursorDoc = await db.collection('appointments').doc(startAfter).get()
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc)
      } else {
        logger.warn(`Pagination cursor document not found: ${startAfter}`)
      }
    }

    // Execute query
    const snapshot = await query.get()
    const bookings = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      bookings.push({
        id: doc.id,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        doctor: data.doctor || null,
        branch: data.branch || null,
        slot: data.slot || null,
        timestamp: data.timestamp || null,
        created_at: data.created_at || null
      })
    })

    logger.info(`Successfully fetched ${bookings.length} bookings for client: ${keyData.client_name}`)
    
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    })
  } catch (error) {
    logger.error('Error fetching bookings from Firestore:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { logger } = require('firebase-functions')

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

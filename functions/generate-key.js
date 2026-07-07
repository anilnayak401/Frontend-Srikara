const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const crypto = require('crypto')
const readline = require('readline')
const path = require('path')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function main() {
  console.log('=== Srikara API Key Generator ===\n')

  let initialized = false

  // 1. Detect environment and initialize Admin SDK
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`Connecting to local Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}...`)
    
    // Ensure project ID is set for local emulator run
    if (!process.env.GCLOUD_PROJECT) {
      process.env.GCLOUD_PROJECT = 'srikara-demo'
    }
    
    initializeApp({
      projectId: process.env.GCLOUD_PROJECT
    })
    initialized = true
  } else {
    // Check for local service account file first
    const serviceAccountPath = path.join(__dirname, 'service-account.json')
    if (fs.existsSync(serviceAccountPath)) {
      console.log(`Using credentials from: ${serviceAccountPath}`)
      const serviceAccount = require(serviceAccountPath)
      initializeApp({
        credential: cert(serviceAccount)
      })
      initialized = true
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log(`Using GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)
      initializeApp()
      initialized = true
    }
  }

  if (!initialized) {
    console.log('\x1b[31m%s\x1b[0m', 'ERROR: No authentication credentials found.')
    console.log('\nTo generate keys for PRODUCTION, place your Firebase service account JSON file at:')
    console.log(`   ${path.join(__dirname, 'service-account.json')}`)
    console.log('\nTo generate keys for LOCAL EMULATOR, run these commands first in your terminal:')
    console.log('   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"')
    console.log('   node generate-key.js')
    rl.close()
    return
  }

  const db = getFirestore()

  // 2. Ask user for Client / Integration Name
  const clientName = await askQuestion('Enter client/system name (e.g., WordPress CMS, HubSpot CRM): ')
  if (!clientName.trim()) {
    console.log('\x1b[31m%s\x1b[0m', 'Error: Client name cannot be empty.')
    rl.close()
    return
  }

  // 3. Ask user for Scopes (comma-separated, default to read:bookings)
  const scopesInput = await askQuestion('Enter allowed scopes comma-separated (default: read:bookings): ')
  let scopes = scopesInput.split(',').map(s => s.trim()).filter(Boolean)
  if (scopes.length === 0) {
    scopes = ['read:bookings']
  }

  // 4. Generate API Key (cryptographically secure random string with prefix)
  const randomHex = crypto.randomBytes(24).toString('hex')
  const apiKey = `sr_live_${randomHex}`
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

  // 5. Store hashed key and metadata in Firestore
  try {
    console.log('Writing hashed key to Firestore...')
    await db.collection('api_keys').doc(hashedKey).set({
      client_name: clientName.trim(),
      status: 'active',
      scopes: scopes,
      created_at: new Date().toISOString()
    })

    console.log('\n\x1b[32m%s\x1b[0m', '==================================================')
    console.log('\x1b[32m%s\x1b[0m', '  API KEY GENERATED SUCCESSFULLY')
    console.log('\x1b[32m%s\x1b[0m', '==================================================')
    console.log(`Client:      ${clientName}`)
    console.log(`Scopes:      ${scopes.join(', ')}`)
    console.log(`API Key:     ${apiKey}`)
    console.log('\x1b[32m%s\x1b[0m', '==================================================')
    console.log('\x1b[33m%s\x1b[0m', 'WARNING: Copy this API Key now! It will NOT be shown again.')
    console.log('Only the SHA-256 hash is saved in your Firestore database.')
    console.log('==================================================\n')

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Firestore database write failed:', error.message)
  } finally {
    rl.close()
  }
}

main()

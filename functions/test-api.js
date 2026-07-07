const assert = require('assert')
const crypto = require('crypto')

// Mock Firebase Admin SDK
const mockDb = {
  collection: (colName) => {
    return {
      doc: (docId) => {
        return {
          get: async () => {
            if (colName === 'api_keys') {
              // Mock keys database
              const keys = {
                [crypto.createHash('sha256').update('sr_live_active_key').digest('hex')]: {
                  exists: true,
                  data: () => ({
                    client_name: 'Test CRM Active',
                    status: 'active',
                    scopes: ['read:bookings'],
                    created_at: new Date().toISOString()
                  })
                },
                [crypto.createHash('sha256').update('sr_live_inactive_key').digest('hex')]: {
                  exists: true,
                  data: () => ({
                    client_name: 'Test CRM Inactive',
                    status: 'inactive',
                    scopes: ['read:bookings'],
                    created_at: new Date().toISOString()
                  })
                },
                [crypto.createHash('sha256').update('sr_live_no_scopes_key').digest('hex')]: {
                  exists: true,
                  data: () => ({
                    client_name: 'Test CRM No Scopes',
                    status: 'active',
                    scopes: [],
                    created_at: new Date().toISOString()
                  })
                }
              }
              return keys[docId] || { exists: false }
            }
            
            if (colName === 'appointments') {
              // Mock appointments database
              const appointments = {
                'doc_cursor': {
                  exists: true,
                  data: () => ({ timestamp: '2026-07-07T10:00:00Z' })
                }
              }
              return appointments[docId] || { exists: false }
            }
          },
          set: async (data) => {
            console.log(`[Mock DB Set] ${colName}/${docId}:`, data)
            return { writeTime: new Date() }
          }
        }
      },
      orderBy: function() { return this },
      limit: function() { return this },
      where: function() { return this },
      startAfter: function() { return this },
      get: async () => {
        // Return list of appointments
        return {
          forEach: (callback) => {
            callback({
              id: 'apt_123',
              data: () => ({
                name: 'John Doe',
                phone: '1234567890',
                email: 'john@example.com',
                doctor: 'Dr. Smith',
                branch: 'ECIL',
                slot: '10:00 AM',
                timestamp: '2026-07-07T10:00:00Z'
              })
            })
          }
        }
      }
    }
  }
}

// Override module cache to inject mocks before loading index.js
require('module')._cache[require.resolve('firebase-admin/app')] = {
  id: require.resolve('firebase-admin/app'),
  exports: { initializeApp: () => {} },
  loaded: true
}

require('module')._cache[require.resolve('firebase-admin/firestore')] = {
  id: require.resolve('firebase-admin/firestore'),
  exports: { getFirestore: () => mockDb },
  loaded: true
}

// Load the Cloud Functions
const { getBookings } = require('./index.js')

const EventEmitter = require('events')

class MockResponse extends EventEmitter {
  constructor() {
    super()
    this.statusVal = 200
    this.jsonVal = null
    this.headersSet = {}
  }
  getHeader(name) {
    return this.headersSet[name.toLowerCase()]
  }
  setHeader(name, value) {
    this.headersSet[name.toLowerCase()] = value
  }
  status(code) {
    this.statusVal = code
    return this
  }
  json(data) {
    this.jsonVal = data
    this.emit('finish')
    return this
  }
}

// Helper to create mock request and response
function createMockRequestResponse({ method = 'GET', headers = {}, query = {} }) {
  const req = { method, headers, query }
  const res = new MockResponse()

  return { 
    req, 
    res, 
    getResult: () => ({ 
      status: res.statusVal, 
      json: res.jsonVal, 
      headers: res.headersSet 
    }) 
  }
}

async function runTests() {
  console.log('Running API Key and getBookings logic tests...\n')

  // Test 1: Only GET requests allowed
  {
    const { req, res, getResult } = createMockRequestResponse({ method: 'POST' })
    await getBookings(req, res)
    const result = getResult()
    assert.strictEqual(result.status, 405, 'Should return 405 for non-GET method')
    assert.strictEqual(result.headers['allow'], 'GET', 'Should return Allow GET header')
    console.log('✓ Test 1 Passed: Correctly rejects non-GET requests (405)')
  }

  // Test 2: Missing API Key
  {
    const { req, res, getResult } = createMockRequestResponse({ headers: {} })
    await getBookings(req, res)
    const result = getResult()
    assert.strictEqual(result.status, 401, 'Should return 401 for missing API Key')
    assert.ok(result.json.error.includes('Missing API Key'), 'Should complain about missing key')
    console.log('✓ Test 2 Passed: Correctly rejects missing API Key (401)')
  }

  // Test 3: Invalid API Key
  {
    const { req, res, getResult } = createMockRequestResponse({ headers: { 'x-api-key': 'sr_live_invalid_key' } })
    await getBookings(req, res)
    const result = getResult()
    assert.strictEqual(result.status, 401, 'Should return 401 for invalid API Key')
    assert.ok(result.json.error.includes('Invalid API Key'), 'Should complain about invalid key')
    console.log('✓ Test 3 Passed: Correctly rejects invalid API Key (401)')
  }

  // Test 4: Inactive API Key
  {
    const { req, res, getResult } = createMockRequestResponse({ headers: { 'x-api-key': 'sr_live_inactive_key' } })
    await getBookings(req, res)
    const result = getResult()
    assert.strictEqual(result.status, 401, 'Should return 401 for inactive API Key')
    assert.ok(result.json.error.includes('Inactive API Key'), 'Should complain about inactive key')
    console.log('✓ Test 4 Passed: Correctly rejects inactive API Key (401)')
  }

  // Test 5: Insufficient Scope
  {
    const { req, res, getResult } = createMockRequestResponse({ headers: { 'x-api-key': 'sr_live_no_scopes_key' } })
    await getBookings(req, res)
    const result = getResult()
    assert.strictEqual(result.status, 403, 'Should return 403 for missing scopes')
    assert.ok(result.json.error.includes('Insufficient scopes'), 'Should complain about scopes')
    console.log('✓ Test 5 Passed: Correctly rejects key with insufficient scopes (403)')
  }

  // Test 6: Successful fetch with valid key
  {
    const { req, res, getResult } = createMockRequestResponse({ headers: { 'x-api-key': 'sr_live_active_key' } })
    await getBookings(req, res)
    const result = getResult()
    assert.strictEqual(result.status, 200, 'Should return 200 for valid key')
    assert.strictEqual(result.json.success, true, 'Response success should be true')
    assert.strictEqual(result.json.count, 1, 'Should return 1 booking')
    assert.strictEqual(result.json.data[0].name, 'John Doe', 'Should match mock booking name')
    console.log('✓ Test 6 Passed: Correctly fetches bookings with valid API Key (200)')
  }

  console.log('\nAll logic tests passed successfully!')
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err)
  process.exit(1)
})

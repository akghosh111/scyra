// Dodo Payments SDK
import DodoPayments from 'dodopayments'

const DODO_PAYMENTS_API_KEY = process.env.DODO_PAYMENTS_API_KEY

console.log('=== DODO SDK INITIALIZATION ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DODO_PAYMENTS_API_KEY present:', !!DODO_PAYMENTS_API_KEY)
console.log('DODO_PAYMENTS_API_KEY prefix:', DODO_PAYMENTS_API_KEY?.substring(0, 15) + '...')
console.log('DODO_PAYMENTS_API_KEY length:', DODO_PAYMENTS_API_KEY?.length)

if (!DODO_PAYMENTS_API_KEY) {
  throw new Error('DODO_PAYMENTS_API_KEY environment variable is not set')
}

const environment = process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode'

console.log('Environment mode:', environment)

export const dodo = new DodoPayments({
  bearerToken: DODO_PAYMENTS_API_KEY,
  environment,
})

console.log('Dodo client initialized')
console.log('Base URL:', (dodo as any).baseURL)
console.log('=== DODO SDK INITIALIZED ===')

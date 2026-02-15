// Dodo Payments SDK
import DodoPayments from 'dodopayments'

const DODO_PAYMENTS_API_KEY = process.env.DODO_PAYMENTS_API_KEY

if (!DODO_PAYMENTS_API_KEY) {
  throw new Error('DODO_PAYMENTS_API_KEY environment variable is not set')
}

export const dodo = new DodoPayments({
  bearerToken: DODO_PAYMENTS_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
})

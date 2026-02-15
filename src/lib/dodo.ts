// Dodo Payments SDK
import DodoPayments from 'dodopayments'

const DODO_API_KEY = process.env.DODO_API_KEY!

export const dodo = new DodoPayments({
  bearerToken: DODO_API_KEY,
})

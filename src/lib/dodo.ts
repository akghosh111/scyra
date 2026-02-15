// Dodo Payments API configuration
// Based on Dodo Payments REST API

const DODO_API_KEY = process.env.DODO_API_KEY!
const DODO_API_BASE_URL = 'https://api.dodopayments.com/v1'

class DodoPaymentsClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${DODO_API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Dodo Payments API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async createCheckoutSession(data: {
    product_cart: Array<{ product_id: string; quantity: number }>
    customer?: { email: string; name?: string }
    return_url: string
    mode?: 'subscription' | 'payment'
    interval?: 'day' | 'week' | 'month' | 'year'
  }) {
    return this.request('/checkout/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createSubscription(data: {
    product_id: string
    customer?: { email: string; name?: string }
    return_url?: string
  }) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCheckoutSession(sessionId: string) {
    return this.request(`/checkout/sessions/${sessionId}`)
  }

  async createPortalSession(data: {
    customer_id: string
    return_url: string
  }) {
    return this.request('/portal/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSubscription(subscriptionId: string) {
    return this.request(`/subscriptions/${subscriptionId}`)
  }

  async cancelSubscription(subscriptionId: string) {
    return this.request(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    })
  }

  async listProducts() {
    return this.request('/products')
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}`)
  }
}

export const dodo = new DodoPaymentsClient(DODO_API_KEY)

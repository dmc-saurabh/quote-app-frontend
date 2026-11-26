import { getShopifyAuthorization } from './shopify.js'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)
  const authorization = await getShopifyAuthorization()
  if (authorization) headers.set('Authorization', authorization)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    })
  } catch {
    throw new Error(`Could not reach the QuoteKit API at ${API_URL}. Check the backend and VITE_API_URL.`)
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const error = new Error(payload?.error || `Request failed with status ${response.status}.`)
    error.status = response.status
    throw error
  }

  return response.json()
}

export function getShopifyInstallUrl(shop, host) {
  const params = new URLSearchParams({ shop })
  if (host) params.set('host', host)
  return `${window.location.origin}/auth/shopify?${params}`
}

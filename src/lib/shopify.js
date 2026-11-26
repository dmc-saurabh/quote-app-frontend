import createApp from '@shopify/app-bridge'
import { getSessionToken } from '@shopify/app-bridge/utilities'

const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY
const host = new URLSearchParams(window.location.search).get('host')

const shopifyApp = apiKey && host
  ? createApp({ apiKey, host, forceRedirect: true })
  : null

export async function getShopifyAuthorization() {
  if (!shopifyApp) return null
  const token = await getSessionToken(shopifyApp)
  return `Bearer ${token}`
}

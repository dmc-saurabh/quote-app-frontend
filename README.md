# QuoteKit frontend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the backend API origin and `VITE_SHOPIFY_API_KEY` to the public Shopify app client ID.
3. Run `npm install`, then `npm run dev`.

The dashboard uses the connected Shopify store for products, quote metafields, saved PDF preferences, and recent quote downloads. Install the QuoteKit theme app extension and place its product and cart blocks in the Shopify theme editor to enable storefront downloads.

For local Shopify OAuth, the Vite dev server forwards `/auth/*` to the backend at `http://localhost:5000`. Expose the frontend dev server through an HTTPS tunnel, then set the backend `APP_URL` and Shopify's app URL to that public frontend origin, with `{APP_URL}/auth/shopify/callback` as the allowed redirect URL. Set `FRONTEND_URL` to the same origin. The production Vercel rewrite forwards `/auth/*` to the backend.

Run `npm run lint` and `npm run build` to validate the frontend.

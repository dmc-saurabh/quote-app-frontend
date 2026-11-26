# QuoteKit frontend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the backend API origin and `VITE_SHOPIFY_API_KEY` to the public Shopify app client ID.
3. Run `npm install`, then `npm run dev`.

The dashboard uses the connected Shopify store for products, quote metafields, saved PDF preferences, and recent quote downloads. Install the QuoteKit theme app extension and place its product and cart blocks in the Shopify theme editor to enable storefront downloads.

Run `npm run lint` and `npm run build` to validate the frontend.

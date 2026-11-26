import { useEffect, useState } from 'react'
import Icon from './components/Icon.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import { apiRequest, getShopifyInstallUrl } from './lib/api.js'
import './App.css'

function formatPrice(amount, currencyCode = 'USD') {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(value)
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`
  }
}

function Overview({ products, quoteTotal, shop, onNavigate, onProductToggle, onConnect, loading }) {
  const enabledCount = products.filter((product) => product.enabled).length

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR STORE AT A GLANCE</p>
          <h1>Overview</h1>
          <p className="page-description">Manage quote downloads for your Shopify storefront.</p>
        </div>
        {shop
          ? <span className="preview-badge connected-badge"><span /> {shop.domain}</span>
          : <button className="button button-purple" onClick={onConnect}><Icon name="store" /> Connect Shopify</button>}
      </div>

      <section className="welcome-card">
        <div className="welcome-copy">
          <span className="welcome-kicker">QUOTE DOWNLOADS</span>
          <h2>Make every product quote-ready.</h2>
          <p>Enable quote metafields for products and let shoppers download a PDF from their cart.</p>
          <button className="button button-light" onClick={() => shop ? onNavigate('Products') : onConnect()}>
            {shop ? 'Set up products' : 'Connect your store'} <Icon name="arrowRight" />
          </button>
        </div>
        <div className="welcome-illustration" aria-hidden="true">
          <div className="quote-paper">
            <div className="paper-mark"><Icon name="file" /></div>
            <span className="paper-line paper-line-long" />
            <span className="paper-line" />
            <span className="paper-line paper-line-short" />
            <div className="paper-total"><span /> <strong>$166.00</strong></div>
          </div>
          <div className="download-chip"><Icon name="download" /> Quote ready</div>
          <span className="illustration-spark spark-one">✳</span>
          <span className="illustration-spark spark-two">✳</span>
        </div>
      </section>

      <section className="metric-grid" aria-label="Store summary">
        <article className="metric-card">
          <div className="metric-icon purple"><Icon name="box" /></div>
          <p>Quote-enabled products</p>
          <strong>{loading ? '…' : enabledCount}</strong>
          <span>{shop ? `of ${products.length} loaded products` : 'Connect a Shopify store to sync'}</span>
        </article>
        <article className="metric-card">
          <div className="metric-icon peach"><Icon name="download" /></div>
          <p>Quotes downloaded</p>
          <strong>{loading ? '…' : quoteTotal}</strong>
          <span>{shop ? 'Recent quote downloads' : 'Connect a Shopify store to begin'}</span>
        </article>
        <article className="metric-card">
          <div className="metric-icon mint"><Icon name="cart" /></div>
          <p>Cart quote requests</p>
          <strong>{loading ? '…' : quoteTotal}</strong>
          <span>{shop ? 'PDF quotes generated' : 'Waiting for Shopify connection'}</span>
        </article>
      </section>

      <div className="content-grid">
        <section className="panel product-panel">
          <div className="panel-heading">
            <div><h2>Quote-ready products</h2><p>Choose which products show the quote option.</p></div>
            <button className="text-button" onClick={() => shop && onNavigate('Products')}>
              View all <Icon name="arrowRight" />
            </button>
          </div>
          {shop
            ? <ProductTable products={products.slice(0, 3)} shop={shop} onToggle={onProductToggle} compact />
            : <div className="panel-empty"><Icon name="box" /><span>Connect your store to load its products.</span></div>}
        </section>

        <section className="panel setup-panel">
          <div className="panel-heading"><div><h2>Getting started</h2><p>Your launch checklist</p></div><span className="progress-count">{shop ? '2 of 3' : '1 of 3'}</span></div>
          <ol className="checklist">
            <li className="checklist-done"><span className="check-circle"><Icon name="check" /></span><div><strong>Explore your dashboard</strong><small>You’re here — nice start!</small></div></li>
            <li className={shop ? 'checklist-done' : ''}><span className="check-circle">{shop ? <Icon name="check" /> : <span>2</span>}</span><div><strong>Connect a Shopify store</strong><small>{shop ? shop.domain : 'Authorize the app in Shopify Admin'}</small></div></li>
            <li><span className="check-circle"><span>3</span></span><div><strong>Enable product quotes</strong><small>Add the quote option to your theme</small></div></li>
          </ol>
          <div className="connection-note"><Icon name="info" /><p>{shop ? 'Product switches save the quote_enabled metafield directly to Shopify.' : 'Connect your Shopify app credentials to install and sync a store.'}</p></div>
        </section>
      </div>

      <section className="workflow-strip">
        <div className="workflow-heading">
          <div><p className="eyebrow">HOW IT WORKS</p><h2>A simpler way to request a quote</h2></div>
          <button className="text-button" onClick={() => onNavigate('Settings')}>Configure quote details <Icon name="arrowRight" /></button>
        </div>
        <div className="workflow-steps">
          <div><span className="workflow-number">01</span><strong>Pick a product</strong><p>Shoppers add quote-enabled items to their cart.</p></div>
          <Icon name="arrowRight" className="workflow-arrow" />
          <div><span className="workflow-number">02</span><strong>Open the cart</strong><p>The quote download action appears with their items.</p></div>
          <Icon name="arrowRight" className="workflow-arrow" />
          <div><span className="workflow-number">03</span><strong>Download a PDF</strong><p>A shareable quote includes customer and product details.</p></div>
        </div>
      </section>
    </>
  )
}

function ProductTable({ products, shop, onToggle, compact = false }) {
  return (
    <div className={`table-wrap${compact ? ' table-compact' : ''}`}>
      <table>
        <thead><tr><th>PRODUCT</th><th>TYPE</th><th>PRICE</th><th>QUOTE OPTION</th></tr></thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <span className="product-avatar">{product.image ? <img src={product.image} alt="" /> : <Icon name="box" />}</span>
                <strong>{product.name}</strong>
              </td>
              <td className="muted-cell">{product.type || '—'}</td>
              <td className="price-cell">{formatPrice(product.price, shop.currencyCode)}</td>
              <td>
                <button
                  type="button"
                  className={`toggle${product.enabled ? ' is-on' : ''}`}
                  role="switch"
                  aria-checked={product.enabled}
                  aria-label={`${product.enabled ? 'Disable' : 'Enable'} quote option for ${product.name}`}
                  onClick={() => onToggle(product)}
                  disabled={product.saving}
                ><span /></button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td className="empty-table" colSpan="4">No products found in this store.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function ProductsPage({ products, shop, onToggle }) {
  const [query, setQuery] = useState('')
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">CATALOG</p><h1>Products</h1><p className="page-description">Control quote availability for each product.</p></div>
        {shop && <span className="preview-badge connected-badge"><span /> {shop.domain}</span>}
      </div>
      <section className="panel full-panel">
        <div className="panel-heading products-heading">
          <div><h2>Product quote settings</h2><p>Changes update the quote metafield on your Shopify products.</p></div>
          <label className="search-field"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label>
        </div>
        <ProductTable products={filteredProducts} shop={shop} onToggle={onToggle} />
        {filteredProducts.length === 0 && products.length > 0 && <p className="empty-state">No products match “{query}”.</p>}
        <p className="table-footnote"><Icon name="info" /> Changes are saved to the product metafield in Shopify.</p>
      </section>
      <section className="notice-card">
        <div className="metric-icon purple"><Icon name="sparkle" /></div>
        <div><strong>Storefront quote button</strong><p>Install the QuoteKit theme app extension and add its product and cart blocks in the Shopify theme editor.</p></div>
        <span className="coming-soon">THEME APP</span>
      </section>
    </>
  )
}

function QuotesPage({ quotes }) {
  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">CUSTOMER ACTIVITY</p><h1>Quotes</h1><p className="page-description">PDF quotes downloaded from your storefront.</p></div></div>
      <section className="panel full-panel">
        <div className="panel-heading"><div><h2>Recent quote downloads</h2><p>Showing the latest 50 quotes for your connected store.</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>QUOTE</th><th>CUSTOMER</th><th>ITEMS</th><th>SUBTOTAL</th><th>DATE</th></tr></thead>
            <tbody>{quotes.map((quote) => (
              <tr key={quote._id}>
                <td><strong>{quote.quoteNumber}</strong></td>
                <td><strong>{quote.customer.name}</strong><br /><span className="muted-cell">{quote.customer.email}</span></td>
                <td>{quote.items.length}</td>
                <td className="price-cell">{formatPrice(quote.subtotal, quote.currencyCode)}</td>
                <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
          {quotes.length === 0 && <div className="panel-empty"><Icon name="file" /><span>No quote downloads yet. They’ll show up here after a customer downloads a PDF.</span></div>}
        </div>
      </section>
    </>
  )
}

function SettingsPage({ settings, onSettingChange }) {
  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">YOUR PREFERENCES</p><h1>Settings</h1><p className="page-description">Choose what to include in a customer’s quote PDF.</p></div></div>
      <section className="panel settings-panel">
        <div className="panel-heading"><div><h2>Quote PDF contents</h2><p>These preferences are saved to your connected store.</p></div></div>
        {[
          ['customerDetails', 'Customer details', 'Include the details entered by the shopper.'],
          ['prices', 'Product prices and totals', 'Include item prices and the cart subtotal.'],
        ].map(([key, title, description]) => (
          <div className="setting-row" key={key}>
            <div><strong>{title}</strong><p>{description}</p></div>
            <button
              type="button"
              className={`toggle${settings[key] ? ' is-on' : ''}`}
              role="switch"
              aria-checked={settings[key]}
              aria-label={title}
              onClick={() => onSettingChange(key, !settings[key])}
            ><span /></button>
          </div>
        ))}
        <div className="connection-note settings-note"><Icon name="info" /><p>The storefront quote PDF uses the selected preferences when the shopper downloads it.</p></div>
      </section>
    </>
  )
}

function ConnectStoreDialog({ onClose, onError }) {
  const [shopDomain, setShopDomain] = useState('')
  const [connecting, setConnecting] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    const normalizedDomain = shopDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')
    if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(normalizedDomain)) {
      onError('Enter your Shopify store domain, for example your-store.myshopify.com.')
      return
    }
    setConnecting(true)
    const host = new URLSearchParams(window.location.search).get('host')
    window.location.assign(getShopifyInstallUrl(normalizedDomain, host))
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="connect-dialog" role="dialog" aria-modal="true" aria-labelledby="connect-title">
        <button className="dialog-close" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button>
        <div className="metric-icon purple"><Icon name="store" /></div>
        <p className="eyebrow">SHOPIFY INSTALL</p>
        <h2 id="connect-title">Connect your store</h2>
        <p>Enter your store domain to continue to Shopify and authorize QuoteKit.</p>
        <form onSubmit={submit}>
          <label htmlFor="shop-domain">Shopify store domain</label>
          <input id="shop-domain" autoFocus autoComplete="url" placeholder="your-store.myshopify.com" value={shopDomain} onChange={(event) => setShopDomain(event.target.value)} />
          <button className="button button-purple" type="submit" disabled={connecting}>{connecting ? 'Opening Shopify…' : 'Continue to Shopify'} <Icon name="arrowRight" /></button>
        </form>
        <small>You’ll approve product read/write access in Shopify Admin.</small>
      </section>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [quoteTotal, setQuoteTotal] = useState(0)
  const [settings, setSettings] = useState({ customerDetails: true, prices: true })
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    let active = true
    const loadShopData = async () => {
      try {
        const session = await apiRequest('/api/session')
        if (!active) return
        setShop(session.shop)

        const productPages = []
        let cursor = null
        let hasMoreProducts = false
        for (let page = 0; page < 10; page += 1) {
          const query = cursor ? `?after=${encodeURIComponent(cursor)}` : ''
          const result = await apiRequest(`/api/products${query}`)
          productPages.push(...result.products)
          hasMoreProducts = result.pageInfo.hasNextPage
          if (!hasMoreProducts) break
          cursor = result.pageInfo.endCursor
        }
        const [quoteResult, settingsResult] = await Promise.all([
          apiRequest('/api/quotes'),
          apiRequest('/api/settings'),
        ])
        if (!active) return
        setProducts(productPages)
        setQuotes(quoteResult.quotes)
        setQuoteTotal(quoteResult.total)
        setSettings(settingsResult.settings)
        if (hasMoreProducts) setErrorMessage('Showing the first 500 products. Use Shopify Admin to manage the rest.')
      } catch (error) {
        if (!active) return
        if (error.status === 401) {
          setShop(null)
          setProducts([])
          setQuotes([])
          setQuoteTotal(0)
        } else {
          setErrorMessage(error.message)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadShopData()
    return () => { active = false }
  }, [])

  const updateProduct = async (product) => {
    setErrorMessage('')
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, saving: true } : item))
    try {
      const result = await apiRequest(`/api/products/${encodeURIComponent(product.id)}/quote-enabled`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !product.enabled }),
      })
      setProducts((current) => current.map((item) => item.id === product.id
        ? { ...item, enabled: result.enabled, saving: false }
        : item))
    } catch (error) {
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, saving: false } : item))
      setErrorMessage(error.message)
    }
  }

  const updateSetting = async (key, value) => {
    setErrorMessage('')
    try {
      const result = await apiRequest('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify({ [key]: value }),
      })
      setSettings(result.settings)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const pageContent = {
    Overview: <Overview products={products} quoteTotal={quoteTotal} shop={shop} loading={loading} onNavigate={setActivePage} onProductToggle={updateProduct} onConnect={() => setDialogOpen(true)} />,
    Products: <ProductsPage products={products} shop={shop} onToggle={updateProduct} />,
    Quotes: <QuotesPage quotes={quotes} />,
    Settings: <SettingsPage settings={settings} onSettingChange={updateSetting} />,
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} shop={shop} />
      <div className="app-main">
        <Topbar shop={shop} onConnect={() => setDialogOpen(true)} />
        <main className="page-content">
          {errorMessage && <div className="app-alert" role="alert"><Icon name="info" /><span>{errorMessage}</span><button aria-label="Dismiss error" onClick={() => setErrorMessage('')}><Icon name="close" size={15} /></button></div>}
          {pageContent[activePage]}
        </main>
        <footer className="app-footer"><span>QuoteKit <span className="footer-dot">·</span> Shopify quote manager</span><span>{shop ? shop.domain : 'STORE NOT CONNECTED'}</span></footer>
      </div>
      {dialogOpen && <ConnectStoreDialog onClose={() => setDialogOpen(false)} onError={setErrorMessage} />}
    </div>
  )
}

export default App

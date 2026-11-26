import { useState } from 'react'
import Icon from './Icon.jsx'

const links = [
  { label: 'Overview', icon: 'grid' },
  { label: 'Products', icon: 'box' },
  { label: 'Quotes', icon: 'file' },
]

function Sidebar({ activePage, onNavigate, shop }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = (page) => {
    onNavigate(page)
    setMobileOpen(false)
  }

  return (
    <>
      <button
        className="mobile-menu-button"
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      ><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar${mobileOpen ? ' sidebar-open' : ''}`}>
        <button className="brand-lockup" onClick={() => navigate('Overview')} aria-label="QuoteKit overview">
          <span className="brand-symbol"><Icon name="file" size={20} /></span>
          <span>quote<span className="brand-accent">kit</span><small>FOR SHOPIFY</small></span>
        </button>
        <div className="store-label">WORKSPACE</div>
        <div className="sidebar-store">
          <span className="store-avatar"><Icon name="store" size={17} /></span>
          <span><strong>{shop?.name || 'Shopify store'}</strong><small>{shop?.domain || 'Not connected'}</small></span>
          <span className={`store-status${shop ? ' store-status-on' : ''}`} aria-label={shop ? 'Connected' : 'Not connected'} />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-section-label">MENU</span>
          {links.map(({ label, icon }) => (
            <button
              className={`nav-link${activePage === label ? ' nav-link-active' : ''}`}
              key={label}
              onClick={() => navigate(label)}
              aria-current={activePage === label ? 'page' : undefined}
            ><Icon name={icon} /><span>{label}</span>{label === 'Quotes' && <span className="nav-soon">NEW</span>}</button>
          ))}
          <span className="nav-section-label nav-section-settings">PREFERENCES</span>
          <button
            className={`nav-link${activePage === 'Settings' ? ' nav-link-active' : ''}`}
            onClick={() => navigate('Settings')}
            aria-current={activePage === 'Settings' ? 'page' : undefined}
          ><Icon name="settings" /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-icon">?</span><strong>Need a hand?</strong><p>Your setup guide is here whenever you need it.</p><span className="help-link">Explore the guide <Icon name="arrowRight" size={14} /></span></div>
          <div className="sidebar-version"><span className={`online-indicator${shop ? ' online-indicator-on' : ''}`} />{shop ? 'Shopify connected' : 'Store not connected'} <span>v0.1</span></div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

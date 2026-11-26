import Icon from './Icon.jsx'

function Topbar({ shop, onConnect }) {
  return (
    <header className="topbar">
      <div className="breadcrumb"><span>Workspace</span><Icon name="arrowRight" size={13} /><strong>Quote manager</strong></div>
      <div className="topbar-actions">
        {shop
          ? <span className="store-connection store-connection-on"><span /> Connected</span>
          : <button className="topbar-connect" onClick={onConnect}><Icon name="store" size={14} /> Connect Shopify</button>}
        <details className="topbar-dropdown">
          <summary className="icon-button" aria-label="Notifications"><Icon name="bell" /><span className="notification-dot" /></summary>
          <div className="dropdown-card notification-card"><strong>You’re all caught up</strong><p>Store activity will appear here after Shopify is connected.</p></div>
        </details>
        <details className="topbar-dropdown profile-dropdown">
          <summary className="profile-button"><span className="profile-avatar">S</span><span className="profile-name">{shop?.name || 'Store admin'}</span><Icon name="chevronDown" size={15} /></summary>
          <div className="dropdown-card profile-card"><span className="profile-avatar">S</span><span><strong>{shop?.name || 'Store admin'}</strong><small>{shop?.domain || 'Shopify account not connected'}</small></span></div>
        </details>
      </div>
    </header>
  )
}

export default Topbar

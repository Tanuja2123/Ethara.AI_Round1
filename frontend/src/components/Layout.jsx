import { NavLink, Outlet } from 'react-router-dom';
import { API_BASE_URL } from '../api/client';
import './Layout.css';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
];

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">📦</span>
          <div>
            <strong>InventoryOS</strong>
            <small>Order Management</small>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <small>API: {API_BASE_URL.replace(/^https?:\/\//, '')}</small>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <span>Inventory & Order Management System</span>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

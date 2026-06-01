import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDashboard();
      setSummary(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert message={error} />;

  const stats = [
    { label: 'Total Products', value: summary.total_products, link: '/products' },
    { label: 'Total Customers', value: summary.total_customers, link: '/customers' },
    { label: 'Total Orders', value: summary.total_orders, link: '/orders' },
    {
      label: 'Low Stock Items',
      value: summary.low_stock_products.length,
      link: '/products',
      warning: summary.low_stock_products.length > 0,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of inventory, customers, and orders</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={loadDashboard}>
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="stat-card card">
            <span className="stat-label">{stat.label}</span>
            <span className={`stat-value ${stat.warning ? 'warning' : ''}`}>{stat.value}</span>
          </Link>
        ))}
      </div>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="section-title">Low Stock Products</h2>
        {summary.low_stock_products.length === 0 ? (
          <p className="empty-state">All products are sufficiently stocked.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>In Stock</th>
                </tr>
              </thead>
              <tbody>
                {summary.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-warning">{product.quantity_in_stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

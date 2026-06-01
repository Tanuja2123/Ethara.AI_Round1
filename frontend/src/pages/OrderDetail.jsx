import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getOrder(id);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Order #{id}</h1>
          <p>Order details and line items</p>
        </div>
        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>

      <Alert type="error" message={error} />

      {order && (
        <>
          <section className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="form-row">
              <div>
                <strong>Customer</strong>
                <p>{order.customer_name}</p>
                <small style={{ color: 'var(--text-muted)' }}>{order.customer_email}</small>
              </div>
              <div>
                <strong>Total Amount</strong>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
              <div>
                <strong>Created</strong>
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="section-title">Line Items</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.product_sku}</td>
                      <td>${item.unit_price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${item.line_total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyLineItem = { product_id: '', quantity: '1' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [lineItems, setLineItems] = useState([{ ...emptyLineItem }]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [ordersData, customersData, productsData] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getProducts(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  function updateLineItem(index, field, value) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, { ...emptyLineItem }]);
  }

  function removeLineItem(index) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  function getEstimatedTotal() {
    return lineItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === Number(item.product_id));
      if (!product || !item.quantity) return sum;
      return sum + product.price * Number(item.quantity);
    }, 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!customerId) {
      setError('Please select a customer');
      return;
    }
    const items = lineItems
      .filter((item) => item.product_id && item.quantity)
      .map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      }));

    if (items.length === 0) {
      setError('Add at least one product to the order');
      return;
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        setError('Quantity must be greater than 0');
        return;
      }
      const product = products.find((p) => p.id === item.product_id);
      if (product && product.quantity_in_stock < item.quantity) {
        setError(
          `Insufficient stock for ${product.name}. Available: ${product.quantity_in_stock}`
        );
        return;
      }
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.createOrder({ customer_id: Number(customerId), items });
      setSuccess('Order created successfully');
      setCustomerId('');
      setLineItems([{ ...emptyLineItem }]);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this order and restore inventory?')) return;
    setError('');
    setSuccess('');
    try {
      await api.deleteOrder(id);
      setSuccess('Order cancelled successfully');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Create orders and track inventory changes</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">Create Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer_id">Customer</label>
            <select
              id="customer_id"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <div className="line-items">
            <label>Order Items</label>
            {lineItems.map((item, index) => (
              <div key={index} className="form-row line-item-row">
                <div className="form-group">
                  <label>Product</label>
                  <select
                    value={item.product_id}
                    onChange={(e) => updateLineItem(index, 'product_id', e.target.value)}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — ${product.price.toFixed(2)} (stock:{' '}
                        {product.quantity_in_stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                {lineItems.length > 1 && (
                  <div className="form-group" style={{ alignSelf: 'end' }}>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeLineItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Estimated total: <strong>${getEstimatedTotal().toFixed(2)}</strong> (final amount
            calculated by backend)
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={addLineItem}>
              Add Item
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="section-title">Order History</h2>
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <p className="empty-state">No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name || `Customer ${order.customer_id}`}</td>
                    <td>{order.items.length}</td>
                    <td>${order.total_amount.toFixed(2)}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(order.id)}
                        >
                          Cancel
                        </button>
                      </div>
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

import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyForm = { name: '', sku: '', price: '', quantity_in_stock: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.sku.trim()) return 'SKU is required';
    if (!form.price || Number(form.price) <= 0) return 'Price must be greater than 0';
    if (form.quantity_in_stock === '' || Number(form.quantity_in_stock) < 0) {
      return 'Stock quantity cannot be negative';
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity_in_stock: parseInt(form.quantity_in_stock, 10),
    };

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        setSuccess('Product updated successfully');
      } else {
        await api.createProduct(payload);
        setSuccess('Product created successfully');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity_in_stock: String(product.quantity_in_stock),
    });
    setError('');
    setSuccess('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    setError('');
    setSuccess('');
    try {
      await api.deleteProduct(id);
      setSuccess('Product deleted successfully');
      if (editingId === id) cancelEdit();
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage product catalog and inventory levels</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="sku">SKU / Code</label>
              <input id="sku" name="sku" value={form.sku} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity_in_stock">Quantity in Stock</label>
              <input
                id="quantity_in_stock"
                name="quantity_in_stock"
                type="number"
                min="0"
                step="1"
                value={form.quantity_in_stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="section-title">Product List</h2>
        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <p className="empty-state">No products yet. Add your first product above.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      {product.quantity_in_stock <= 10 ? (
                        <span className="badge badge-warning">{product.quantity_in_stock}</span>
                      ) : (
                        <span className="badge badge-success">{product.quantity_in_stock}</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
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

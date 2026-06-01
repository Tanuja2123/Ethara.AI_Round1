import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyForm = { full_name: '', email: '', phone: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!form.full_name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address';
    if (!form.phone.trim()) return 'Phone number is required';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setSuccess('Customer created successfully');
      setForm(emptyForm);
      await loadCustomers();
    } catch (err) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this customer?')) return;
    setError('');
    setSuccess('');
    try {
      await api.deleteCustomer(id);
      setSuccess('Customer deleted successfully');
      await loadCustomers();
    } catch (err) {
      setError(err.message || 'Failed to delete customer');
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage customer records and contact information</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Customer'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2 className="section-title">Customer List</h2>
        {loading ? (
          <LoadingSpinner />
        ) : customers.length === 0 ? (
          <p className="empty-state">No customers yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.full_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
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

const API_BASE_URL = normalizeApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:8000');

function normalizeApiUrl(url) {
  if (!url) return 'http://localhost:8000';
  const trimmed = url.trim().replace(/\/$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new ApiError(
      `Cannot reach backend at ${API_BASE_URL}. Check VITE_API_URL on Netlify and redeploy.`,
      0
    );
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }

  if (!response.ok) {
    const message =
      typeof data?.detail === 'string'
        ? data.detail
        : data?.detail?.message || data?.message || 'Request failed';
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  getDashboard: () => request('/dashboard'),
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (payload) =>
    request('/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getCustomers: () => request('/customers'),
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (payload) =>
    request('/customers', { method: 'POST', body: JSON.stringify(payload) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (payload) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
};

export { API_BASE_URL, ApiError };

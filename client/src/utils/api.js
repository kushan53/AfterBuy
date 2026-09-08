const API_BASE = '/api';

/**
 * Helper to make authenticated API requests to the AfterBuy backend
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('afterbuy_auth_token') || sessionStorage.getItem('afterbuy_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

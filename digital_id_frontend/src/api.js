//
// PUBLIC_INTERFACE
// Simple REST API integration layer for Digital ID Management Dashboard.
// Handles authentication headers, base URLs and error management.
//

const API_BASE = process.env.REACT_APP_API_URL || '/api';

// Helper to get auth token (from localStorage, or later cookies etc)
export function getToken() {
  return localStorage.getItem('token');
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  // Attach Authorization header if token present
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  const resp = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  let data;
  try {
    data = await resp.json();
  } catch (e) {
    data = null;
  }
  if (!resp.ok) {
    const err = new Error(data?.detail || 'API Error');
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

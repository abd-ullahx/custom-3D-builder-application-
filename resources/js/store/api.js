/**
 * Centralized API helper for Redux Toolkit async thunks.
 * All backend calls go through this utility to ensure consistent
 * CSRF token injection, headers, and error handling.
 */

const getCsrfToken = () =>
  document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-CSRF-TOKEN': getCsrfToken(),
});

/**
 * Smart API request wrapper.
 * @param {string} url - The endpoint URL
 * @param {object} options - { method, body, headers }
 * @returns {Promise<object>} - Parsed JSON response
 * @throws {object} - { message, status, errors }
 */
export const apiRequest = async (url, options = {}) => {
  const { method = 'GET', body = null, headers = {} } = options;

  const config = {
    method,
    headers: { ...defaultHeaders(), ...headers },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    // Laravel validation errors come back as { message, errors: { field: [...] } }
    const errorMessage = data.message || data.error || 'Something went wrong';
    throw { message: errorMessage, status: response.status, errors: data.errors || null };
  }

  return data;
};

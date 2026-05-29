/**
 * API Client Configuration
 * Centralized HTTP client for all API requests
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestConfig {
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * Get stored authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Build authorization headers with token
 */
const getHeaders = (config?: RequestConfig): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response and errors
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      error = {
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }

    console.error('🚨 API Error Response:', { status: response.status, error });

    throw {
      message: error.message || error.error || `HTTP Error: ${response.status}`,
      statusCode: response.status,
      code: error.code,
    };
  }

  const data = await response.json();
  console.log('✅ API Response Success:', data);
  return data;
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Clear authentication token from localStorage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * Generic GET request
 */
export const apiGet = async <T>(
  endpoint: string,
  config?: RequestConfig,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(config),
  });

  return handleResponse<T>(response);
};

/**
 * Generic POST request
 */
export const apiPost = async <T>(
  endpoint: string,
  config?: RequestConfig,
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(config),
      body: config?.body ? JSON.stringify(config.body) : undefined,
    });

    console.log('📥 Response:', {
      status: response.status,
      ok: response.ok,
    });
    return handleResponse<T>(response);
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    throw error;
  }
};

/**
 * Generic PUT request
 */
export const apiPut = async <T>(
  endpoint: string,
  config?: RequestConfig,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(config),
    body: config?.body ? JSON.stringify(config.body) : undefined,
  });

  return handleResponse<T>(response);
};

/**
 * Generic DELETE request
 */
export const apiDelete = async <T>(
  endpoint: string,
  config?: RequestConfig,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(config),
  });

  return handleResponse<T>(response);
};

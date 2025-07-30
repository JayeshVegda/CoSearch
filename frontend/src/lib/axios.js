import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://cosearch-backend.onrender.com/api' : 'http://localhost:8484/api'),
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    // No logging
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common response scenarios
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    // No logging
    return response;
  },
  (error) => {
    // Calculate request duration for failed requests
    if (error.config?.metadata?.startTime) {
      const duration = new Date() - error.config.metadata.startTime;
      // No logging
    }

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show access denied message
          break;
        case 404:
          // Not found
          break;
        case 422:
          // Validation errors
          break;
        case 500:
          // Server error
          break;
        default:
          break;
      }

      // Return a consistent error format
      return Promise.reject({
        status,
        message: data.message || 'Request failed',
        errors: data.errors || [],
        originalError: error,
      });
    } else if (error.request) {
      // Network error
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        originalError: error,
      });
    } else {
      // Other errors
      return Promise.reject({
        status: -1,
        message: error.message || 'Request configuration error',
        originalError: error,
      });
    }
  }
);

export default api;
 
/**
 * Central configuration for MKWise Financial frontend.
 * Dynamically determines the API URL based on the current hostname.
 */
export const getApiUrl = () => {
  // If a specific VITE_API_URL is provided in the environment (and is not localhost), use it
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:5000') {
    return import.meta.env.VITE_API_URL;
  }

  // Detect local development environment
  const isLocalhost = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.');

  if (isLocalhost) {
    return 'http://localhost:5000';
  }

  // Fallback to the production backend URL on Render.
  // TODO: Replace this placeholder with your exact Render backend URL if it differs
  return 'https://mkwisefinancial-backend.onrender.com';
};

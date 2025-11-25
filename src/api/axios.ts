import axios from 'axios';
import { API_URL } from '../lib/constants';
import { manageLocalStorage } from '../lib/localstorage';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Always attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = manageLocalStorage.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  // Don't override Content-Type if FormData is being used (for file uploads)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']; // Let axios set it automatically with boundary
  }
  return config;
}, (error) => Promise.reject(error));

//  Global error handler for authentication
//  Handles: 401 (token refresh), auth-related 400 errors (logout)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip if no response (network error) - let components handle it
    if (!error.response) {
      return Promise.reject(error);
    }
    
    const status = error.response.status;
    const requestUrl = originalRequest?.url || '';
    
    // Handle 401 Unauthorized - Try to refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint (cookies automatically sent)
        const res = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // Save new token to localStorage
        const newToken = res.data.token;
        manageLocalStorage.set('token', newToken);

        // Add token to original request and retry it
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh fails, logout user
        manageLocalStorage.remove('token');
        window.location.href = '/signin';
        return Promise.reject(err);
      }
    }
    
    // Handle 400 Bad Request - Only logout if auth-related
    if (status === 400) {
      // Check if it's an auth endpoint
      const isAuthEndpoint = requestUrl.includes('/auth/validate') || 
                             requestUrl.includes('/auth/refresh') ||
                             requestUrl.includes('/auth/login') ||
                             requestUrl.includes('/auth/register');
      
      // Only logout on auth-related 400 errors
      if (isAuthEndpoint) {
        manageLocalStorage.remove('token');
        window.location.href = '/signin';
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

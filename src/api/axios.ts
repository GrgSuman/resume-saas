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
  return config;
}, (error) => Promise.reject(error));

//  Refresh token if 401 error occurs
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If token expired (401) and not retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint (cookies automatically sent)
        const res = await axios.get(`${API_URL}/auth/refresh`,{
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

    return Promise.reject(error);
  }
);

export default axiosInstance;

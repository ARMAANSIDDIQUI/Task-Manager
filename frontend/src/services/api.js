import axios from 'axios';

// This creates an axios instance so we don't have to type the base URL every time
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// This interceptor grabs the token from localStorage and sticks it in the header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

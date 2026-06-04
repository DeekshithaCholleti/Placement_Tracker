import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token; // The backend uses token in headers via verifyToken middleware (assuming req.headers.token or Authorization)
      config.headers.Authorization = `Bearer ${token}`; // Just to be safe, attaching to both or following standard
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

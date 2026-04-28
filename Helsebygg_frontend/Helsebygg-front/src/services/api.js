import axios from 'axios';

const API_BASE_URL = '/api/v1'; // Vite proxy will forward to http://192.168.10.10:4020/api/v1

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies and credentials
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
};

export const avvikAPI = {
  getAll: () => api.get('/avvik'),
  getById: (id) => api.get(`/avvik/${id}`),
  create: (avvikData) => api.post('/avvik', avvikData),
  getByStatus: (statusId) => api.get(`/avvik/status/${statusId}`),
  updateStatus: (id, statusId) => api.put(`/avvik/${id}/status`, { statusId }),
};

export default api;
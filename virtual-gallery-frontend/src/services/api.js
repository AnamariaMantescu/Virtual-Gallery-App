import axios from 'axios';
import store from '@/store';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

api.interceptors.request.use(
  config => {
    const token = store.state.auth.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.mensagem || error.response?.data?.message || '';
      
      if (errorMessage.toLowerCase().includes('não confirmado') || 
          errorMessage.toLowerCase().includes('verifique seu e-mail') ||
          errorMessage.toLowerCase().includes('conta não ativada')) {
        
        let email = '';
        try {
          if (originalRequest.data) {
            const requestData = JSON.parse(originalRequest.data);
            email = requestData.email || '';
          }
        } catch (e) {
        }
        
        if (email) {
          localStorage.setItem('pendingConfirmationEmail', email);
        }
        
        if (!window.location.pathname.includes('/reenviar-confirmacao') &&
            !window.location.pathname.includes('/confirmar-email')) {
          window.location.href = '/reenviar-confirmacao';
        }
        
        return Promise.reject(error);
      }
    }
    
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => Promise.reject(err));
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await axios.post('http://localhost:8080/auth/refresh-token', null, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
      
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      processQueue(null, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
      
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('pendingConfirmationEmail');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
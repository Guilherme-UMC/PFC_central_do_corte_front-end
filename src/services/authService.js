import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          role: response.data.role,
          email: email
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async signup(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signup_ADM_BARBEARIA(userData) {
    try {
      const response = await api.post('/auth/register/barbearia', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
  
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
  
  isAuthenticated() {
    return !!this.getToken();
  }
  
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  }
  
  isBarbeariaAdm() {
    return this.getUserRole() === 'ROLE_BARBEARIA_ADM';
  }
  
  isCliente() {
    return this.getUserRole() === 'ROLE_CLIENTE';
  }
  
  async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token');
      
      const response = await api.post('/auth/refresh-token', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();
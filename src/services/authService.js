import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Armazena todos os dados do usuário incluindo role
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          role: response.data.role, // ROLE_CLIENTE ou ROLE_BARBEARIA_ADM
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
      const requestData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        telefone: userData.telefone
      };
      
      console.log('Enviando dados para /auth/register:', requestData);
      
      const response = await api.post('/auth/register', requestData);
      console.log('Resposta do cadastro:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro no signup:', error);
      throw error;
    }
  }

  async signup_ADM_BARBEARIA(userData) {
    try {
      const requestData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        telefone: userData.telefone
      };
      
      console.log('Enviando dados para /auth/register/barbearia:', requestData);
      
      const response = await api.post('/auth/register/barbearia', requestData);
      console.log('Resposta do cadastro:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro no signup:', error);
      throw error;
    }
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
  
  // Novo método para verificar a role do usuário
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
}

export default new AuthService();
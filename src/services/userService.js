import api from './api';

class UserService {
  async getProfile(userId) {
    try {
      const response = await api.get(`/usuarios/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar perfil' };
    }
  }

  async updateProfile(userId, userData) {
    try {
      const response = await api.put(`/usuarios/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao atualizar perfil' 
      };
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      await api.post(`/usuarios/${userId}/change-password`, {
        oldPassword,
        newPassword
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao alterar senha' 
      };
    }
  }

  async getAllUsers() {
    try {
      const response = await api.get('/usuarios');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar usuários' };
    }
  }

  async getUserById(userId) {
    try {
      const response = await api.get(`/usuarios/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Usuário não encontrado' };
    }
  }
}

export default new UserService();
import api from './api';

class UserService {
  async getProfile() {
    try {
      const response = await api.get('/users/{id}');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await api.put('/users/{id}', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
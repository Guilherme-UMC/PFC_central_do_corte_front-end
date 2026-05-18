import api from './api';

class AdminService {
  async criarUsuario(userData) {
    try {
      const response = await api.post('/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar usuário'
      };
    }
  }

  async criarAdmin(userData) {
    try {
      const response = await api.post('/users/admin', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar administrador'
      };
    }
  }

  async listarTodosUsuarios() {
    try {
      const response = await api.get('/usuarios');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar usuários' };
    }
  }

  async listarUsuariosPorRole(role) {
    try {
      const response = await api.get(`/usuarios/role/${role}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar usuários' };
    }
  }

  async buscarUsuariosPorNome(nome) {
    try {
      const response = await api.get('/usuarios/search', { params: { name: nome } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar usuários' };
    }
  }

  async ativarDesativarUsuario(userId) {
    try {
      await api.patch(`/usuarios/${userId}/toggle-status`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar status do usuário' };
    }
  }

  async deletarUsuario(userId) {
    try {
      await api.delete(`/usuarios/${userId}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao deletar usuário' };
    }
  }

  async listarTodasBarbeariasAdmin(page = 0, size = 20) {
    try {
      const response = await api.get('/barbearia', { params: { page, size } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar barbearias' };
    }
  }

  async ativarDesativarBarbeariaAdmin(barbeariaId) {
    try {
      await api.patch(`/barbearia/${barbeariaId}/toggle-status`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar status da barbearia' };
    }
  }

  async listarBarbeariasPorProprietario(proprietarioId) {
    try {
      const response = await api.get(`/barbearia/owner/${proprietarioId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar barbearias do proprietário' };
    }
  }
}

export default new AdminService();
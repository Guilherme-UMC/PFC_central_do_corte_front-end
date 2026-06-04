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

  async listarTodosUsuarios(page = 0, size = 10, ativo = null, role = null, search = null) {
    try {
      const params = { page, size };
      if (ativo !== null) params.ativo = ativo;
      if (role) params.role = role;
      if (search) params.search = search;
      
      const response = await api.get('/usuarios', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return { 
        success: false, 
        message: 'Erro ao listar usuários',
        data: { content: [], totalPages: 0, totalElements: 0 }
      };
    }
  }

  async listarUsuariosPorRole(role) {
    try {
      const response = await api.get(`/usuarios/role/${role}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar usuários', data: [] };
    }
  }

  async buscarUsuariosPorNome(nome) {
    try {
      const response = await api.get('/usuarios/search', { params: { name: nome } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao buscar usuários', data: [] };
    }
  }

  async ativarDesativarUsuario(userId) {
    try {
      const response = await api.patch(`/usuarios/${userId}/toggle-status`);
      return { success: true, message: response.data?.message || 'Status alterado com sucesso' };
    } catch (error) {
      let errorMessage = 'Erro ao alterar status do usuário';
      
      if (error.response?.data?.mensagem) {
        errorMessage = error.response.data.mensagem;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  }

  async deletarUsuario(userId) {
    try {
      await api.delete(`/usuarios/${userId}`);
      return { success: true, message: 'Usuário removido com sucesso' };
    } catch (error) {
      let errorMessage = 'Erro ao deletar usuário';
      
      if (error.response?.data?.mensagem) {
        errorMessage = error.response.data.mensagem;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  }

  async listarTodasBarbeariasAdmin(page = 0, size = 20) {
    try {
      const response = await api.get('/barbearia', { params: { page, size } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar barbearias', data: [] };
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
      return { success: false, message: 'Erro ao listar barbearias do proprietário', data: [] };
    }
  }
}

export default new AdminService();
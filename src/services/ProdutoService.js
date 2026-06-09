import api from './api';

class ProdutoService {
  async listarPorBarbearia(barbeariaId, page = 0, size = 20) {
    try {
      const response = await api.get(`/api/produtos/barbearia/${barbeariaId}`, {
        params: { page, size }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return { success: false, message: 'Erro ao listar produtos', data: { content: [] } };
    }
  }

  async listarTodosPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/produtos/barbearia/${barbeariaId}/todos`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return { success: false, message: 'Erro ao listar produtos', data: [] };
    }
  }

  async listarCategorias(barbeariaId) {
    try {
      const response = await api.get(`/api/produtos/barbearia/${barbeariaId}/categorias`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return { success: false, message: 'Erro ao listar categorias', data: [] };
    }
  }

  async criar(barbeariaId, produtoData) {
    try {
      const response = await api.post(`/api/produtos/barbearia/${barbeariaId}`, produtoData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar produto'
      };
    }
  }

  async atualizar(produtoId, produtoData) {
    try {
      const response = await api.put(`/api/produtos/${produtoId}`, produtoData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar produto'
      };
    }
  }

  async desativar(produtoId) {
    try {
      await api.delete(`/api/produtos/${produtoId}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao desativar produto:', error);
      return { success: false, message: 'Erro ao desativar produto' };
    }
  }

  async ativar(produtoId) {
    try {
      await api.patch(`/api/produtos/${produtoId}/ativar`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao ativar produto:', error);
      return { success: false, message: 'Erro ao ativar produto' };
    }
  }
}

export default new ProdutoService();
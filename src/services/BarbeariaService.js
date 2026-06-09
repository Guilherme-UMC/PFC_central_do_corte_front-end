import api from './api';

class BarbeariaService {
  async criar(dados) {
    try {
      const response = await api.post('/barbearia', dados);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao cadastrar'
      };
    }
  }

  async listarTodas(page = 0, size = 10) {
  try {
    const response = await api.get('/barbearia', { params: { page, size } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: 'Erro ao listar barbearias' };
  }
}

  async buscarPorId(id) {
    try {
      const response = await api.get(`/barbearia/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Barbearia não encontrada' };
    }
  }

  async buscarPorNome(nome) {
    try {
      const response = await api.get('/barbearia/buscar', { params: { nome } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro na busca' };
    }
  }

  async buscarPorLocalizacao(cidade, uf) {
    try {
      const response = await api.get('/barbearia/buscar-por-localizacao', {
        params: { cidade, uf }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro na busca' };
    }
  }

  async minhasBarbearias() {
    try {
      const response = await api.get('/barbearia/minhas');
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        return { success: true, data: [] };
      }
      return { success: false, message: 'Erro ao buscar suas barbearias' };
    }
  }

  async atualizar(id, dados) {
    try {
      const response = await api.put(`/barbearia/${id}`, dados);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao atualizar'
      };
    }
  }

  async updateBarbearia(id, dados) {
    return this.atualizar(id, dados);
  }

  async deletar(id) {
    try {
      await api.delete(`/barbearia/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao deletar barbearia' };
    }
  }

  async ativarDesativar(id) {
    try {
      await api.patch(`/barbearia/${id}/toggle-status`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }
}

export default new BarbeariaService();

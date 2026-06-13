import api from './api';

class ServicoService {
  async criar(barbeariaId, servicoData) {
    try {
      const dataToSend = {
        nome: servicoData.nome,
        descricao: servicoData.descricao || null,
        preco: servicoData.preco,
        duracaoMinutos: servicoData.duracaoMinutos,
        categoria: servicoData.categoria 
      };
      
      const response = await api.post(`/api/servicos/barbearia/${barbeariaId}`, dataToSend);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar serviço'
      };
    }
  }

  async atualizar(servicoId, servicoData) {
    try {
      const dataToSend = {
        nome: servicoData.nome,
        descricao: servicoData.descricao || null,
        preco: servicoData.preco,
        duracaoMinutos: servicoData.duracaoMinutos,
        categoria: servicoData.categoria
      };
      
      const response = await api.put(`/api/servicos/${servicoId}`, dataToSend);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao atualizar serviço'
      };
    }
  }

  async listarPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/servicos/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      return { success: false, message: 'Erro ao listar serviços', data: [] };
    }
  }
  
  async listarPorCategoria(barbeariaId, categoria) {
    try {
      const response = await api.get(`/api/servicos/barbearia/${barbeariaId}/categoria/${categoria}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar serviços por categoria:', error);
      return { success: false, message: 'Erro ao listar serviços', data: [] };
    }
  }
  
  async listarCategoriasDaBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/servicos/barbearia/${barbeariaId}/categorias`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return { success: false, message: 'Erro ao listar categorias', data: [] };
    }
  }
  
  async listarTodasCategorias() {
    try {
      const response = await api.get('/api/servicos/categorias');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return { success: false, message: 'Erro ao listar categorias', data: [] };
    }
  }
  
  async buscarBarbeariasPorCategoria(categoria) {
    try {
      const response = await api.get('/api/servicos/buscar-barbearias', { params: { categoria } });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar barbearias por categoria:', error);
      return { success: false, message: 'Erro ao buscar barbearias', data: [] };
    }
  }

  async desativar(servicoId) {
    try {
      await api.delete(`/api/servicos/${servicoId}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao desativar serviço' };
    }
  }
}

export default new ServicoService();
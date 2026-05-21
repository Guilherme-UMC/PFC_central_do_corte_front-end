import api from './api';

class ServicoService {
  async criar(barbeariaId, servicoData) {
    try {
      const response = await api.post(`/api/servicos/barbearia/${barbeariaId}`, servicoData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar serviço'
      };
    }
  }

  async listarPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/servicos/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar serviços' };
    }
  }

  async atualizar(servicoId, servicoData) {
    try {
      const response = await api.put(`/api/servicos/${servicoId}`, servicoData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao atualizar serviço'
      };
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
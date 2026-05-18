// src/services/FuncionarioService.js
import api from './api';

class FuncionarioService {
  async criar(barbeariaId, funcionarioData) {
    try {
      const response = await api.post(`/api/funcionarios/barbearia/${barbeariaId}`, funcionarioData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar funcionário'
      };
    }
  }

  async vincularExistente(barbeariaId, funcionarioEmail) {
    try {
      await api.post(`/api/funcionarios/barbearia/${barbeariaId}/vincular`, { funcionarioEmail });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao vincular funcionário'
      };
    }
  }

  async listarPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/funcionarios/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar funcionários' };
    }
  }

  async listarDisponiveis() {
    try {
      const response = await api.get('/api/funcionarios/disponiveis');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar funcionários disponíveis' };
    }
  }

  async verificarDisponibilidade(barbeariaId, funcionarioId, dataHora) {
    try {
      const response = await api.get(`/api/funcionarios/barbearia/${barbeariaId}/disponibilidade`, {
        params: { funcionarioId, dataHora }
      });
      return { success: true, disponivel: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao verificar disponibilidade' };
    }
  }

  async desvincular(barbeariaId, funcionarioId) {
    try {
      await api.delete(`/api/funcionarios/barbearia/${barbeariaId}/desvincular/${funcionarioId}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao desvincular funcionário' };
    }
  }

  async buscarPorId(funcionarioId) {
    try {
      const response = await api.get(`/api/funcionarios/${funcionarioId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Funcionário não encontrado' };
    }
  }

  async atualizar(funcionarioId, dados) {
    try {
      const response = await api.put(`/api/funcionarios/${funcionarioId}`, dados);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao atualizar funcionário'
      };
    }
  }
}

export default new FuncionarioService();
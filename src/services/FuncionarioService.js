import api from './api';

class FuncionarioService {
  // Criar novo funcionário e vincular à barbearia
  async criar(barbeariaId, funcionarioData) {
    try {
      // ✅ URL CORRETA
      const response = await api.post(`/api/funcionarios/barbearia/${barbeariaId}`, funcionarioData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar funcionário'
      };
    }
  }

  // Vincular funcionário existente à barbearia
  async vincularExistente(barbeariaId, email) {
    try {
      // ✅ URL CORRETA
      const response = await api.post(`/api/funcionarios/barbearia/${barbeariaId}/vincular`, {
        funcionarioEmail: email
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao vincular funcionário:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao vincular funcionário'
      };
    }
  }

  // Listar funcionários de uma barbearia
  async listarPorBarbearia(barbeariaId) {
    try {
      // ✅ URL CORRETA
      const response = await api.get(`/api/funcionarios/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      return { success: false, message: 'Erro ao listar funcionários' };
    }
  }

  // Desvincular funcionário da barbearia
  async desvincular(barbeariaId, funcionarioId) {
    try {
      // ✅ URL CORRETA
      const response = await api.delete(`/api/funcionarios/barbearia/${barbeariaId}/desvincular/${funcionarioId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao desvincular funcionário:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao desvincular funcionário'
      };
    }
  }

  // Listar funcionários disponíveis (sem vínculo)
  async listarDisponiveis() {
    try {

      const response = await api.get('/api/funcionarios/disponiveis');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar funcionários disponíveis:', error);
      return { success: false, message: 'Erro ao listar funcionários disponíveis' };
    }
  }
}

export default new FuncionarioService();
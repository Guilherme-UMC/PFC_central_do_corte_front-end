import api from './api';

class AgendamentoService {
  async criar(agendamentoData) {
    try {
      const response = await api.post('/api/agendamentos', agendamentoData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar agendamento',
        details: error.response?.data
      };
    }
  }

  async listarMeus() {
    try {
      const response = await api.get('/api/agendamentos/meus');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar seus agendamentos' };
    }
  }

  async listarPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/agendamentos/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar agendamentos da barbearia' };
    }
  }

  async atualizarStatus(agendamentoId, status) {
    try {
      const response = await api.patch(`/api/agendamentos/${agendamentoId}/status`, null, {
        params: { status }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar status do agendamento' };
    }
  }

  async cancelar(agendamentoId) {
    return this.atualizarStatus(agendamentoId, 'CANCELADO');
  }

  async confirmar(agendamentoId) {
    return this.atualizarStatus(agendamentoId, 'CONFIRMADO');
  }

  async finalizar(agendamentoId) {
    return this.atualizarStatus(agendamentoId, 'FINALIZADO');
  }
}

export default new AgendamentoService();
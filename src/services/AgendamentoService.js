
import api from './api';

class AgendamentoService {
 
  async criar(dados) {
    try {
      const response = await api.post('/api/agendamentos', dados);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar agendamento'
      };
    }
  }

  
  async listarMeus() {
    try {
      const response = await api.get('/api/agendamentos/cliente/meus');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar meus agendamentos:', error);
      return { success: false, message: 'Erro ao listar seus agendamentos', data: [] };
    }
  }

  
  async listarPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/agendamentos/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar agendamentos da barbearia:', error);
      return { success: false, message: 'Erro ao listar agendamentos', data: [] };
    }
  }

  
  async listarDoDia(barbeariaId) {
    try {
      const response = await api.get(`/api/agendamentos/barbearia/${barbeariaId}/hoje`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar agendamentos do dia:', error);
      return { success: false, message: 'Erro ao listar agendamentos do dia', data: [] };
    }
  }

  async listarMeusComoFuncionario() {
    try {
      const response = await api.get('/api/agendamentos/funcionario/meus');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar seus agendamentos (funcionário):', error);
      return { success: false, message: 'Erro ao listar seus agendamentos', data: [] };
    }
  }

  async listarMeusHojeComoFuncionario() {
    try {
      const response = await api.get('/api/agendamentos/funcionario/hoje');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao listar seus agendamentos do dia (funcionário):', error);
      return { success: false, message: 'Erro ao listar agendamentos do dia', data: [] };
    }
  }

  async cancelar(agendamentoId, motivo) {
    try {
      const response = await api.put(`/api/agendamentos/${agendamentoId}/cancelar`, null, {
        params: { motivo }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao cancelar agendamento'
      };
    }
  }

  async confirmar(agendamentoId) {
    try {
      const response = await api.put(`/api/agendamentos/${agendamentoId}/confirmar`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao confirmar agendamento'
      };
    }
  }

  async concluir(agendamentoId) {
    try {
      const response = await api.put(`/api/agendamentos/${agendamentoId}/concluir`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao concluir agendamento:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao concluir agendamento'
      };
    }
  }
}

export default new AgendamentoService();
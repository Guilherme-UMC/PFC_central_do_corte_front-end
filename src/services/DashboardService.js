import api from './api';

class DashboardService {
  
  async getMetricas(barbeariaId) {
    try {
      const response = await api.get(`/api/dashboard/barbearia/${barbeariaId}/metricas`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao buscar métricas',
        data: this.getDadosMockados()
      };
    }
  }

  async getAgendamentosPorPeriodo(barbeariaId, periodo = 'mes') {
    try {
      const response = await api.get(`/api/dashboard/barbearia/${barbeariaId}/agendamentos-periodo`, {
        params: { periodo }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar agendamentos por período:', error);
      return { success: false, data: this.getDadosAgendamentosMockados() };
    }
  }

  async getServicosPopulares(barbeariaId) {
    try {
      const response = await api.get(`/api/dashboard/barbearia/${barbeariaId}/servicos-populares`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar serviços populares:', error);
      return { success: false, data: [] };
    }
  }

  getDadosMockados() {
    return {
      totalAgendamentos: 47,
      agendamentosMes: 23,
      taxaConfirmacao: 85,
      faturamentoMes: 1250.00,
      clientesAtendidos: 42,
      mediaAvaliacao: 4.8,
      cancelamentos: 7,
      servicosRealizados: 89
    };
  }

  getDadosAgendamentosMockados() {
    return {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      valores: [12, 19, 15, 25, 22, 23]
    };
  }
}

export default new DashboardService();
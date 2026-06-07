import api from './api';

class LogService {
  
  async buscarLogs(filtros = {}, page = 0, size = 20) {
    try {
      const params = new URLSearchParams();
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.acao) params.append('acao', filtros.acao);
      if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      params.append('page', filtros.page || page);
      params.append('size', size);
      
      const response = await api.get(`/api/admin/logs?${params.toString()}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return { success: false, message: error.response?.data?.message };
    }
  }

  async getTipos() {
    try {
      const response = await api.get('/api/admin/logs/tipos');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async getAcoes() {
    try {
      const response = await api.get('/api/admin/logs/acoes');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async getEstatisticas() {
    try {
      const response = await api.get('/api/admin/logs/estatisticas');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: {} };
    }
  }
}

export default new LogService();
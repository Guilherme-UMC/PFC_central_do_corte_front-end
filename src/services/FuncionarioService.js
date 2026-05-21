import api from './api';

export const DIAS_SEMANA = [
  { value: 'MONDAY', label: 'Segunda-feira' },
  { value: 'TUESDAY', label: 'Terça-feira' },
  { value: 'WEDNESDAY', label: 'Quarta-feira' },
  { value: 'THURSDAY', label: 'Quinta-feira' },
  { value: 'FRIDAY', label: 'Sexta-feira' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' }
];

class HorarioService {
  async criar(barbeariaId, horarioData) {
    try {
      const response = await api.post(`/api/horarios/barbearia/${barbeariaId}`, horarioData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao criar horário'
      };
    }
  }

  async listarPorBarbearia(barbeariaId) {
    try {
      const response = await api.get(`/api/horarios/barbearia/${barbeariaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar horários' };
    }
  }

  async listarPorDia(barbeariaId, diaSemana) {
    try {
      const response = await api.get(`/api/horarios/barbearia/${barbeariaId}/dia/${diaSemana}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao listar horários' };
    }
  }

  async atualizar(horarioId, horarioData) {
    try {
      const response = await api.put(`/api/horarios/${horarioId}`, horarioData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao atualizar horário'
      };
    }
  }

  async desativar(horarioId) {
    try {
      await api.delete(`/api/horarios/${horarioId}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao desativar horário' };
    }
  }

  async ativar(horarioId) {
    try {
      await api.patch(`/api/horarios/${horarioId}/ativar`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao ativar horário' };
    }
  }

  async removerPermanentemente(horarioId) {
    try {
      await api.delete(`/api/horarios/${horarioId}/permanente`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao remover horário' };
    }
  }

  async verificarHorario(barbeariaId, diaSemana, hora) {
    try {
      const response = await api.get(`/api/horarios/barbearia/${barbeariaId}/verificar`, {
        params: { diaSemana, hora }
      });
      return { success: true, valido: response.data };
    } catch (error) {
      return { success: false, message: 'Erro ao verificar horário' };
    }
  }
}

export default new HorarioService();
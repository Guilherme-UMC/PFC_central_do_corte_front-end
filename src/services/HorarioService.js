import api from './api';

// DIAS DA SEMANA EM PORTUGUÊS (correto para o backend)
export const DIAS_SEMANA = [
  { value: 'SEGUNDA', label: 'Segunda-feira' },
  { value: 'TERCA', label: 'Terça-feira' },
  { value: 'QUARTA', label: 'Quarta-feira' },
  { value: 'QUINTA', label: 'Quinta-feira' },
  { value: 'SEXTA', label: 'Sexta-feira' },
  { value: 'SABADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' }
];

class HorarioService {
  // Buscar horários de funcionamento da barbearia
  async getHorarios(barbeariaId) {
    try {
      const response = await api.get(`/api/barbearias/${barbeariaId}/horarios`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      return { success: false, message: 'Erro ao buscar horários' };
    }
  }

  // Atualizar horários de funcionamento (PUT - substitui todos)
  async updateHorarios(barbeariaId, horarios) {
    try {
      // Garantir que os dias estão em português
      const horariosCorrigidos = horarios.map(h => ({
        ...h,
        dia: h.dia // já deve estar em português (SEGUNDA, TERCA, etc.)
      }));
      
      const response = await api.put(`/api/barbearias/${barbeariaId}/horarios`, horariosCorrigidos);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || 'Erro ao salvar horários'
      };
    }
  }

  // Buscar horários disponíveis para agendamento
  async getHorariosDisponiveis(barbeariaId, data, duracaoServico = 30) {
    try {
      const response = await api.get(`/api/barbearias/${barbeariaId}/horarios-disponiveis`, {
        params: { data, duracaoServico }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return { success: false, message: 'Erro ao buscar horários disponíveis' };
    }
  }
}

export default new HorarioService();
import api from './api';

export const DIAS_SEMANA = [
  { value: 'SEGUNDA', label: 'Segunda-feira' },
  { value: 'TERCA', label: 'Terça-feira' },
  { value: 'QUARTA', label: 'Quarta-feira' },
  { value: 'QUINTA', label: 'Quinta-feira' },
  { value: 'SEXTA', label: 'Sexta-feira' },
  { value: 'SABADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' }
];

export const HORARIOS_PADRAO = [
  { dia: 'SEGUNDA', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false },
  { dia: 'TERCA', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false },
  { dia: 'QUARTA', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false },
  { dia: 'QUINTA', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false },
  { dia: 'SEXTA', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false },
  { dia: 'SABADO', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false },
  { dia: 'DOMINGO', horaAbertura: '09:00', horaFechamento: '18:00', fechado: false }
];

class HorarioService {

  async getHorarios(barbeariaId) {
    try {
      const response = await api.get(`/api/barbearias/${barbeariaId}/horarios`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      return { success: false, message: 'Erro ao buscar horários' };
    }
  }

  async updateHorarios(barbeariaId, horarios) {
    try {
      if (!horarios || !Array.isArray(horarios) || horarios.length === 0) {
        return { success: false, message: 'Nenhum horário para salvar' };
      }
      
      const horariosCorrigidos = horarios.map(horario => ({
        dia: horario.dia.toUpperCase(),
        horaAbertura: horario.fechado ? null : (horario.horaAbertura || null),
        horaFechamento: horario.fechado ? null : (horario.horaFechamento || null),
        fechado: horario.fechado || false
      }));
      
      const response = await api.put(`/api/barbearias/${barbeariaId}/horarios`, horariosCorrigidos);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'Erro ao salvar horários'
      };
    }
  }

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

  async criarHorariosPadrao(barbeariaId) {
    return this.updateHorarios(barbeariaId, HORARIOS_PADRAO);
  }

  async verificarSeEstaAberta(barbeariaId, dataHora) {
    try {
      const data = dataHora.split('T')[0];
      const horarios = await this.getHorariosDisponiveis(barbeariaId, data);
      
      if (!horarios.success) return false;
      
      const horarioEncontrado = horarios.data.find(h => h.horario === dataHora);
      
      return horarioEncontrado?.disponivel === true;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  }

  converterHorariosParaFrontend(horariosBackend) {
    if (!horariosBackend || !Array.isArray(horariosBackend) || horariosBackend.length === 0) {
      return [...HORARIOS_PADRAO];
    }
    
    return DIAS_SEMANA.map(dia => {
      const horario = horariosBackend.find(h => h.dia === dia.value);
      return {
        dia: dia.value,
        horaAbertura: horario?.horaAbertura || '09:00',
        horaFechamento: horario?.horaFechamento || '18:00',
        fechado: horario?.fechado || false
      };
    });
  }

  validarHorarios(horarios) {
    const errors = [];
    
    for (const horario of horarios) {
      if (!horario.dia) {
        errors.push('Dia não informado');
        continue;
      }
      
      if (!horario.fechado) {
        if (!horario.horaAbertura) {
          errors.push(`${horario.dia}: Horário de abertura é obrigatório`);
        }
        if (!horario.horaFechamento) {
          errors.push(`${horario.dia}: Horário de fechamento é obrigatório`);
        }
        if (horario.horaAbertura && horario.horaFechamento && horario.horaAbertura >= horario.horaFechamento) {
          errors.push(`${horario.dia}: Horário de abertura deve ser menor que o de fechamento`);
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
}

export default new HorarioService();
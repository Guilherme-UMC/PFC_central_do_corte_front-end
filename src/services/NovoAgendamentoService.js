import api from './api';
import horarioService from './HorarioService';

export const listarBarbearias = async () => {
  try {
    const response = await api.get('/barbearia');
    return response.data.content || response.data || [];
  } catch (error) {
    console.error('Erro ao listar barbearias:', error);
    return [];
  }
};

export const buscarBarbearia = async (barbeariaId) => {
  try {
    const response = await api.get(`/barbearia/${barbeariaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar barbearia:', error);
    return null;
  }
};

export const listarServicos = async (barbeariaId) => {
  try {
    const response = await api.get(`/api/servicos/barbearia/${barbeariaId}`);
    return response.data || [];
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return [];
  }
};

export const listarFuncionarios = async (barbeariaId) => {
  try {
    const response = await api.get(`/api/funcionarios/barbearia/${barbeariaId}`);
    return response.data || [];
  } catch (error) {
    console.warn('Erro ao buscar funcionários:', error);
    return [];
  }
};

/**
 * Buscar horários disponíveis para agendamento
 * @param {string} barbeariaId - ID da barbearia
 * @param {Array} servicoIds - IDs dos serviços (não usado atualmente, mas mantido para compatibilidade)
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {string|null} funcionarioId - ID do funcionário (opcional)
 * @returns {Promise<Array>} - Lista de horários disponíveis
 */
export const buscarHorariosDisponiveis = async (barbeariaId, servicoIds, data, funcionarioId = null) => {
  try {
    console.log('🔍 Buscando horários disponíveis:', { barbeariaId, data, funcionarioId });
    
    // Buscar horários disponíveis diretamente do backend
    const result = await horarioService.getHorariosDisponiveis(barbeariaId, data, 30);
    
    console.log('📥 Resposta do backend:', result);
    
    if (result.success && result.data) {
      // Filtrar apenas horários disponíveis e retornar como array de strings ISO
      const horariosDisponiveis = result.data
        .filter(h => h.disponivel === true)
        .map(h => h.horario);
      
      console.log('✅ Horários disponíveis encontrados:', horariosDisponiveis.length, horariosDisponiveis);
      return horariosDisponiveis;
    }
    
    console.warn('⚠️ Nenhum horário disponível encontrado ou erro na resposta');
    return [];
  } catch (error) {
    console.error('❌ Erro ao buscar horários disponíveis:', error);
    return [];
  }
};

/**
 * Criar um novo agendamento
 * @param {Object} payload - Dados do agendamento
 * @param {string} payload.barbeariaId - ID da barbearia
 * @param {Array} payload.servicoIds - IDs dos serviços
 * @param {string} payload.dataHora - Data e hora no formato ISO
 * @param {string|null} payload.funcionarioId - ID do funcionário (opcional)
 * @param {string|null} payload.observacao - Observação (opcional)
 * @returns {Promise<Object>} - Dados do agendamento criado
 */
export const criarAgendamento = async (payload) => {
  try {
    // Validação dos dados
    if (!payload.barbeariaId) {
      throw new Error('ID da barbearia é obrigatório');
    }
    if (!payload.servicoIds || payload.servicoIds.length === 0) {
      throw new Error('Pelo menos um serviço é obrigatório');
    }
    if (!payload.dataHora) {
      throw new Error('Data e hora são obrigatórias');
    }
    
    const requestBody = {
      barbeariaId: payload.barbeariaId,
      servicoId: payload.servicoIds[0], // Backend aceita apenas um serviço por vez
      funcionarioId: payload.funcionarioId || null, // ✅ ADICIONADO: campo do funcionário
      dataHora: payload.dataHora,
      observacao: payload.observacao || null
    };
    
    console.log('📤 Enviando requisição de agendamento:', requestBody);
    
    const response = await api.post('/api/agendamentos', requestBody);
    console.log('✅ Agendamento criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error(' Erro ao criar agendamento:', error.response?.data || error.message);
    throw error;
  }
};

export const listarMeusAgendamentos = async () => {
  try {
    const response = await api.get('/api/agendamentos/cliente/meus');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar meus agendamentos:', error);
    return [];
  }
};
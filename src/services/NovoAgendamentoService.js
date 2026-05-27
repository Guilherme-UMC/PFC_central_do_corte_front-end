import api from './api';
import horarioService from './HorarioService';

export const listarBarbearias = async () => {
  const response = await api.get('/barbearia');
  return response.data.content || response.data;
};

export const buscarBarbearia = async (barbeariaId) => {
  const response = await api.get(`/barbearia/${barbeariaId}`);
  return response.data;
};

export const listarServicos = async (barbeariaId) => {
  const response = await api.get(`/api/servicos/barbearia/${barbeariaId}`);
  return response.data;
};

export const listarFuncionarios = async (barbeariaId) => {
  try {
    const response = await api.get(`/api/funcionarios/barbearia/${barbeariaId}`);
    return response.data;
  } catch (error) {
    console.warn('Erro ao buscar funcionários:', error);
    return [];
  }
};

// FUNÇÃO CORRIGIDA - Buscar horários disponíveis
export const buscarHorariosDisponiveis = async (barbeariaId, servicoIds, data, funcionarioId = null) => {
  try {
    // Se não houver serviços selecionados, retorna vazio
    if (!servicoIds || servicoIds.length === 0) {
      return [];
    }
    
    // Buscar horários disponíveis diretamente do backend
    const result = await horarioService.getHorariosDisponiveis(barbeariaId, data, 30);
    
    if (result.success && result.data) {
      // Filtrar apenas horários disponíveis e retornar como array de strings ISO
      const horariosDisponiveis = result.data
        .filter(h => h.disponivel === true)
        .map(h => h.horario);
      
      console.log('Horários disponíveis encontrados:', horariosDisponiveis);
      return horariosDisponiveis;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    return [];
  }
};

export const criarAgendamento = async (payload) => {
  // Verificar se temos todos os dados necessários
  if (!payload.barbeariaId || !payload.servicoIds || payload.servicoIds.length === 0 || !payload.dataHora) {
    throw new Error('Dados incompletos para criar agendamento');
  }
  
  const requestBody = {
    barbeariaId: payload.barbeariaId,
    servicoId: payload.servicoIds[0], // Por enquanto apenas um serviço
    dataHora: payload.dataHora,
    observacao: payload.observacao || null
  };
  
  const response = await api.post('/api/agendamentos', requestBody);
  return response.data;
};

export const listarMeusAgendamentos = async () => {
  const response = await api.get('/api/agendamentos/cliente/meus');
  return response.data;
};
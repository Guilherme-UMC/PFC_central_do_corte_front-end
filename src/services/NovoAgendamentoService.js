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

export const buscarHorariosDisponiveis = async (barbeariaId, servicoIds, data, funcionarioId = null) => {
  try {    
    const result = await horarioService.getHorariosDisponiveis(barbeariaId, data, 30);
        
    if (result.success && result.data) {
      const horariosDisponiveis = result.data
        .filter(h => h.disponivel === true)
        .map(h => h.horario);
      
      return horariosDisponiveis;
    }
    
    console.warn('Nenhum horário disponível encontrado ou erro na resposta');
    return [];
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    return [];
  }
};

export const criarAgendamento = async (payload) => {
  try {
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
      servicoId: payload.servicoIds[0], 
      funcionarioId: payload.funcionarioId || null, 
      dataHora: payload.dataHora,
      observacao: payload.observacao || null
    };
    
    console.log('Enviando requisição de agendamento:', requestBody);
    
    const response = await api.post('/api/agendamentos', requestBody);
    console.log('Agendamento criado com sucesso:', response.data);
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
import api from './api';

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
  const response = await api.get(`/api/funcionarios/barbearia/${barbeariaId}`);
  return response.data;
};


//ainda não temos
export const buscarHorariosDisponiveis = async (barbeariaId, servicoIds, data, funcionarioId = null) => {
  console.warn('Endpoint buscarHorariosDisponiveis não implementado no backend');
  return [];
};

export const criarAgendamento = async (payload) => {
  const response = await api.post('/api/agendamentos', payload);
  return response.data;
};

export const listarMeusAgendamentos = async () => {
  const response = await api.get('/api/agendamentos/meus');
  return response.data;
};

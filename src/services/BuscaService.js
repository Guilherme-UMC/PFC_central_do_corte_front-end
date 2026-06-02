import api from './api';

class BuscaService {
  
  async buscar(termo) {
    if (!termo || termo.trim().length < 2) {
      return { success: true, data: { barbearias: [], tipo: 'nenhum' } };
    }

    const termoLimpo = termo.trim();
    
    if (this.isCep(termoLimpo)) {
      return this.buscarPorCep(termoLimpo);
    }
    
    if (this.isCidadeUf(termoLimpo)) {
      return this.buscarPorLocalizacao(termoLimpo);
    }
    
    return this.buscarPorNome(termoLimpo);
  }

  isCep(termo) {
    const cepNumerico = termo.replace(/\D/g, '');
    return cepNumerico.length === 8;
  }

  isCidadeUf(termo) {
    const partes = termo.trim().split(/\s+/);
    if (partes.length < 2) return false;
    const ultima = partes[partes.length - 1];
    return /^[A-Z]{2}$/.test(ultima);
  }

  async buscarPorCep(cep) {
    try {
      const cepNumerico = cep.replace(/\D/g, '');
      const response = await api.get(`/barbearia/buscar-por-cep/avancado/${cepNumerico}`);
      return { 
        success: true, 
        data: {
          barbearias: response.data.barbearias || [],
          tipo: 'cep',
          endereco_do_cep: response.data.endereco_do_cep,
          mensagem: response.data.mensagem
        }, 
        tipo: 'cep' 
      };
    } catch (error) {
      console.error('Erro na busca por CEP:', error);
      return { success: false, data: null, message: 'CEP não encontrado' };
    }
  }

  async buscarPorLocalizacao(termo) {
    try {
      const partes = termo.trim().split(/\s+/);
      const uf = partes.pop().toUpperCase();
      const cidade = partes.join(' ');
      
      const response = await api.get('/barbearia/buscar-por-localizacao', {
        params: { cidade, uf }
      });
      return { 
        success: true, 
        data: { 
          barbearias: response.data || [], 
          tipo: 'localizacao' 
        }, 
        tipo: 'localizacao' 
      };
    } catch (error) {
      console.error('Erro na busca por localização:', error);
      return { success: false, data: null, message: 'Erro na busca' };
    }
  }

  async buscarPorNome(nome) {
    try {
      const response = await api.get('/barbearia/buscar', { params: { nome } });
      return { 
        success: true, 
        data: { 
          barbearias: response.data || [], 
          tipo: 'nome' 
        }, 
        tipo: 'nome' 
      };
    } catch (error) {
      console.error('Erro na busca por nome:', error);
      return { success: false, data: null, message: 'Erro na busca' };
    }
  }
}

export default new BuscaService();
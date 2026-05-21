import axios from 'axios';
 
class ViaCepService {
  async buscarCep(cep) {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
 
      if (cepLimpo.length !== 8) {
        return { success: false, message: 'CEP deve conter 8 dígitos' };
      }
 
      const response = await axios.get(`http://localhost:8080/barbearia/buscar-cep/${cepLimpo}`);
      const d = response.data;
 
      return {
        success: true,
        data: {
          logradouro: d.logradouro || '',
          bairro:     d.bairro     || '',
          cidade:     d.cidade     || d.localidade || '',
          uf:         d.uf         || '',
          cep:        d.cep        || cepLimpo
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || error.response?.data?.message || 'CEP não encontrado'
      };
    }
  }
}
 
export default new ViaCepService();
 
import api from './api';

class RecuperacaoSenhaService {
  
  async solicitarRedefinicao(email) {
    try {
      const response = await api.post('/auth/esqueci-senha', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || 'Erro ao solicitar redefinição de senha'
      };
    }
  }
  
  async redefinirSenha(token, novaSenha) {
    try {
      const response = await api.post('/auth/redefinir-senha', { token, novaSenha });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.mensagem || 'Erro ao redefinir senha'
      };
    }
  }
  
  async validarToken(token) {
    try {
      const response = await api.get('/auth/validar-token', { params: { token } });
      return { success: true, valido: response.data.valido };
    } catch (error) {
      return { success: false, valido: false };
    }
  }
}

export default new RecuperacaoSenhaService();
import { useState, useEffect } from 'react';
import authService from '../services/AuthService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      return { success: true, data };
    } catch (error) {
      let errorMessage = 'Erro ao fazer login. Tente novamente';

      if (error.response?.status === 401 || error.response?.status === 422) {
        errorMessage = 'Email ou senha inválidos';
      } else if (error.response?.data?.mensagem) {
        // Novo formato do back: { status, titulo, mensagem, timestamp }
        errorMessage = error.response.data.mensagem;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authService.signup(userData);
      return { success: true, data };
    } catch (error) {
      let errorMessage = 'Erro ao fazer cadastro. Tente novamente.';

      if (error.response?.status === 409) {
        // EmailAlreadyExistsException retorna 409
        errorMessage = error.response.data?.mensagem || 'Email já cadastrado.';
      } else if (error.response?.data?.mensagem) {
        errorMessage = error.response.data.mensagem;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errosPorCampo) {
        // Erros de validação de campos: { email: "...", nome: "..." }
        const erros = Object.values(error.response.data.errosPorCampo);
        errorMessage = erros.join('. ');
      }

      return { success: false, error: errorMessage };
    }
  };

  const signupAdmBarbearia = async (userData) => {
    try {
      const data = await authService.signup_ADM_BARBEARIA(userData);
      return { success: true, data };
    } catch (error) {
      let errorMessage = 'Erro ao fazer cadastro. Tente novamente.';

      if (error.response?.status === 409) {
        errorMessage = error.response.data?.mensagem || 'Email já cadastrado.';
      } else if (error.response?.data?.mensagem) {
        errorMessage = error.response.data.mensagem;
      } else if (error.response?.data?.errosPorCampo) {
        const erros = Object.values(error.response.data.errosPorCampo);
        errorMessage = erros.join('. ');
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    signup,
    signupAdmBarbearia,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    isBarbeariaAdm: authService.isBarbeariaAdm(),
    isCliente: authService.isCliente()
  };
};

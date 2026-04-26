import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (token && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro no login' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro no cadastro' };
    }
  };

  // NOVO: Método para cadastro de barbearia
  const signupAdmBarbearia = async (userData) => {
    try {
      const response = await authService.signup_ADM_BARBEARIA(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro no cadastro de barbearia' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    signupAdmBarbearia, // Exportar o novo método
    logout
  };
};
// Formata telefone para exibição
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

// Remove caracteres não numéricos
export const cleanPhone = (phone) => {
  return phone.replace(/\D/g, '');
};

// Verifica se o usuário está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Obtém o token do localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Obtém o usuário do localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Salva logs de erro (pode ser enviado para um serviço de logs)
export const logError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  // Aqui você pode enviar para um serviço de logs como Sentry, LogRocket, etc.
};

// Debounce para evitar múltiplas chamadas
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
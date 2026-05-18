export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  password: (password) => {
    return password && password.length >= 6;
  },
  
  phone: (phone) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
  },
  
  name: (name) => {
    return name && name.trim().length >= 3;
  }
};

export const getErrorMessage = (field, value) => {
  if (!validators.required(value)) {
    return 'Este campo é obrigatório';
  }
  
  switch(field) {
    case 'email':
      return !validators.email(value) ? 'Email inválido' : '';
    case 'password':
      return !validators.password(value) ? 'A senha deve ter no mínimo 6 caracteres' : '';
    case 'telefone':
      return !validators.phone(value) ? 'Telefone inválido (apenas números, 10 ou 11 dígitos)' : '';
    case 'name':
      return !validators.name(value) ? 'Nome deve ter pelo menos 3 caracteres' : '';
    default:
      return '';
  }
};
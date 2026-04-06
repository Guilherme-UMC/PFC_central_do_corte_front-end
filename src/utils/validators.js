    export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password) => {
    return password && password.length >= 6;
  },
  
  phone: (phone) => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone);
  },
  
  required: (value) => {
    return value && value.trim() !== '';
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
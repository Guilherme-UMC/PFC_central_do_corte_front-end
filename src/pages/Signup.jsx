import { useState } from 'react';
import InputFields from '../components/InputFields';
import SocialLogin from '../components/SocialLogin';
import { validators } from '../utils/validators';
import { useAuthContext } from '../contexts/AuthContext';

const Signup = ({ onSwitchToLogin }) => {
  const { signup } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    telefone: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.telefone) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!validators.email(formData.email)) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    if (!validators.password(formData.password)) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!validators.phone(formData.telefone)) {
      setError('Telefone inválido. Use apenas números (10 ou 11 dígitos)');
      setLoading(false);
      return;
    }

    if (!validators.name(formData.name)) {
      setError('Nome deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone,
        role: "ROLE_CLIENTE"
      };

      const result = await signup(userData);
      
      if (result.success) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
        setFormData({
          name: '',
          telefone: '',
          email: '',
          password: ''
        });

        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="form-title">Criar Conta</h2>
      <SocialLogin />

      <p className="separetor"><span>ou</span></p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <InputFields 
          type="text" 
          placeholder="Nome completo" 
          icon="person"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        
        <InputFields 
          type="tel" 
          placeholder="Telefone (apenas números)" 
          icon="call"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
        />
        
        <InputFields 
          type="email" 
          placeholder="E-mail" 
          icon="mail"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <InputFields 
          type="password" 
          placeholder="Senha (mínimo 6 caracteres)" 
          icon="lock"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p className="sugnup-text">
        Já tem uma conta?
        <a href="#" onClick={(e) => {
          e.preventDefault();
          onSwitchToLogin();
        }}>Fazer Login</a>
      </p>
    </>
  )
}

export default Signup
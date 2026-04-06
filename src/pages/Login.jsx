import { useState } from 'react';
import InputFields from '../components/InputFields';
import SocialLogin from '../components/SocialLogin';
import { validators } from '../utils/validators';
import { useAuthContext } from '../contexts/AuthContext';

const Login = ({ onSwitchToSignup }) => {
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!validators.email(formData.email)) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <h2 className="form-title">Fazer Login</h2>
      <SocialLogin />
      <p className="separetor"><span>ou</span></p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <InputFields 
          type="email" 
          placeholder="Email" 
          icon="mail"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <InputFields 
          type="password" 
          placeholder="Senha" 
          icon="lock"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        
        <a href="#" className="forgot-pass-link">Esqueceu a senha?</a>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Login'}
        </button>
      </form>

      <p className="sugnup-text">
        Não tem uma conta?
        <a href="#" onClick={(e) => {
          e.preventDefault();
          onSwitchToSignup();
        }}>Criar Conta</a>
      </p>
    </>
  );
};

export default Login;
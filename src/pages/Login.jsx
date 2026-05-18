import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { validators } from '../utils/validators';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (!validators.email(formData.email)) {
      setError('Email invalido.');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error || 'Email ou senha invalidos.');
    }

    setLoading(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={handleBackToHome}>
        <IconArrowLeft />
      </button>

      <div className="auth-card">
        <h2 className="auth-title">Entrar</h2>
        <p className="auth-subtitle">Acesse sua conta</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input id="password" className="form-input" type="password" name="password" placeholder="Sua senha" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Nao tem conta?
          <Link to="/signup">Criar Conta</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
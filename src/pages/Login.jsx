import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { validators } from '../utils/validators';
import PasswordInput from '../components/PasswordInput';
import authService from '../services/AuthService';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailNaoConfirmado, setEmailNaoConfirmado] = useState(false);
  const [emailParaReenvio, setEmailParaReenvio] = useState('');
  const [reenviando, setReenviando] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setEmailNaoConfirmado(false);
  };

  const handleReenviarConfirmacao = async () => {
    setReenviando(true);
    const result = await authService.reenviarConfirmacao(emailParaReenvio);
    if (result.success) {
      alert('E-mail de confirmação reenviado! Verifique sua caixa de entrada.');
      setEmailNaoConfirmado(false);
    } else {
      alert(result.message);
    }
    setReenviando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailNaoConfirmado(false);

    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (!validators.email(formData.email)) {
      setError('Email inválido.');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      const errorMsg = result.error || '';
      if (errorMsg.toLowerCase().includes('não confirmado') || 
          errorMsg.toLowerCase().includes('verifique seu e-mail') ||
          errorMsg.toLowerCase().includes('conta não ativada')) {
        setEmailParaReenvio(formData.email);
        setEmailNaoConfirmado(true);
      } else {
        setError(result.error || 'Email ou senha inválidos.');
      }
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

        {emailNaoConfirmado && (
          <div className="alert alert-warning" style={{ 
            backgroundColor: '#1a1a2e', 
            borderColor: '#d4af37',
            textAlign: 'center'
          }}>
            <p><strong>📧 E-mail não confirmado</strong></p>
            <p>Enviamos um link de confirmação para <strong>{emailParaReenvio}</strong></p>
            <p>Verifique sua caixa de entrada (e pasta de spam) e clique no link para ativar sua conta.</p>
            <button 
              onClick={handleReenviarConfirmacao}
              className="btn-secondary"
              style={{ 
                marginTop: 8, 
                background: 'transparent',
                border: '1px solid #d4af37',
                color: '#d4af37',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              disabled={reenviando}
            >
              {reenviando ? 'Enviando...' : 'Reenviar e-mail de confirmação'}
            </button>
            <p style={{ marginTop: 12, fontSize: 12 }}>
              <Link to="/reenviar-confirmacao" style={{ color: '#d4af37' }}>
                Clique aqui se não recebeu o e-mail
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              id="email" 
              className="form-input" 
              type="email" 
              name="email" 
              placeholder="seu@email.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
    
          <PasswordInput
            id="password"
            name="password"
            label="Senha"
            placeholder="Sua senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-link">
          <p>Não tem conta? <Link to="/signup">Criar Conta</Link></p>
          <p>Esqueceu sua senha? <Link to="/esqueci-senha">Recuperar</Link></p>
          <p>Quer criar uma Barbearia? 
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup-barbearia'); }}>
              Cadastrar Barbearia
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
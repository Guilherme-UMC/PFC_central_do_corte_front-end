import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { validators } from '../utils/validators';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import TermosModal from '../components/TermosModal';
import authService from '../services/AuthService';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup, pendingConfirmationEmail, clearPendingConfirmation } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [showTermosModal, setShowTermosModal] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [reenviando, setReenviando] = useState(false);
  const [formData, setFormData] = useState({
    name: '', telefone: '', email: '', password: '', confirmPassword: ''
  });

  useState(() => {
    if (pendingConfirmationEmail) {
      setRegisteredEmail(pendingConfirmationEmail);
      setPendingConfirmation(true);
    }
  }, [pendingConfirmationEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleCheckboxChange = (e) => {
    setAceiteTermos(e.target.checked);
    setError('');
  };

  const handleOpenTermos = (e) => {
    e.preventDefault();
    setShowTermosModal(true);
  };

  const handleCloseTermos = () => {
    setShowTermosModal(false);
  };

  const handleReenviarConfirmacao = async () => {
    setReenviando(true);
    const result = await authService.reenviarConfirmacao(registeredEmail);
    if (result.success) {
      setSuccess('E-mail de confirmação reenviado! Verifique sua caixa de entrada.');
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError(result.message);
      setTimeout(() => setError(''), 5000);
    }
    setReenviando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!aceiteTermos) {
      setError('Você precisa aceitar os termos e condições para continuar.');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.telefone || !formData.confirmPassword) {
      setError('Preencha todos os campos.');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem.');
      setLoading(false);
      return;
    }
    if (!validators.email(formData.email)) { 
      setError('Email inválido.'); 
      setLoading(false); 
      return; 
    }
    if (!validators.password(formData.password)) { 
      setError('Senha: mínimo 6 caracteres.'); 
      setLoading(false); 
      return; 
    }
    if (!validators.phone(formData.telefone)) { 
      setError('Telefone inválido.'); 
      setLoading(false); 
      return; 
    }
    if (!validators.name(formData.name)) { 
      setError('Nome: mínimo 3 caracteres.'); 
      setLoading(false); 
      return; 
    }

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      telefone: formData.telefone
    });

    if (result.success) {
      setRegisteredEmail(result.email);
      setPendingConfirmation(true);
      setSuccess('Cadastro realizado! Enviamos um link de confirmação para seu e-mail.');
    } else {
      setError(result.error || 'Erro ao cadastrar.');
    }
    setLoading(false);
  };

  const handleBackToHome = () => { 
    if (pendingConfirmation) {
      clearPendingConfirmation();
    }
    navigate('/');
  };

  if (pendingConfirmation) {
    return (
      <div className="auth-container">
        <button className="auth-back-btn" onClick={handleBackToHome}>
          <IconArrowLeft />
        </button>
        <div className="auth-card">
          <h2 className="auth-title">Quase lá!</h2>
          <div className="alert alert-success">
            Enviamos um link de confirmação para <strong>{registeredEmail}</strong>
          </div>
          <p style={{ marginTop: 16, textAlign: 'center' }}>
            Verifique sua caixa de entrada (e também a pasta de spam) e clique no link para ativar sua conta.
          </p>
          <p style={{ marginTop: 8, textAlign: 'center', fontSize: 13, color: '#8a8278' }}>
            Não recebeu o e-mail? 
            <button 
              onClick={handleReenviarConfirmacao}
              disabled={reenviando}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#d4af37', 
                cursor: 'pointer',
                marginLeft: 4,
                textDecoration: 'underline'
              }}
            >
              {reenviando ? 'Enviando...' : 'Reenviar e-mail'}
            </button>
          </p>
          <button 
            className="btn btn-primary btn-block" 
            onClick={() => navigate('/login')}
            style={{ marginTop: 16 }}
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={handleBackToHome}>
        <IconArrowLeft />
      </button>

      <div className="auth-card">
        <h2 className="auth-title">Criar Conta</h2>
        <p className="auth-subtitle">Cadastre-se como cliente</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome completo</label>
            <input id="name" className="form-input" type="text" name="name" placeholder="Seu nome" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="telefone">Telefone</label>
            <input id="telefone" className="form-input" type="tel" name="telefone" placeholder="11999999999" value={formData.telefone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
          </div>

          <PasswordInput
            id="password"
            name="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="form-group termos-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={aceiteTermos}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              Li e aceito os 
              <a href="#" onClick={handleOpenTermos}> Termos e Condições</a>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-link">
          <p>Já tem conta?
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Fazer Login</a>
        </p>
        <p>
          É proprietário?
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup-barbearia'); }}>Cadastrar Barbearia</a>
        </p>
        </div>
      </div>

      <TermosModal 
        isOpen={showTermosModal} 
        onClose={handleCloseTermos} 
        tipo="cliente"
      />
    </div>
  );
};

export default Signup;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/AuthService';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ReenviarConfirmacao = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await authService.reenviarConfirmacao(email);

    if (result.success) {
      setEnviado(true);
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  const handleBackToLogin = () => navigate('/login');

  if (enviado) {
    return (
      <div className="auth-container">
        <button className="auth-back-btn" onClick={handleBackToLogin}>
          <IconArrowLeft />
        </button>
        <div className="auth-card">
          <h2 className="auth-title">E-mail Enviado!</h2>
          <div className="alert alert-success">{message.text}</div>
          <p>
            Verifique sua caixa de entrada (e também a pasta de spam) e clique no link para ativar sua conta.
          </p>
          <button className="btn btn-primary btn-block" onClick={handleBackToLogin}>
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={handleBackToLogin}>
        <IconArrowLeft />
      </button>

      <div className="auth-card">
        <h2 className="auth-title">Reenviar Confirmação</h2>
        <p className="auth-subtitle">
          Digite seu e-mail para receber um novo link de confirmação
        </p>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de confirmação'}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
};

export default ReenviarConfirmacao;
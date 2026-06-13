import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../services/AuthService';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ConfirmarEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [reenviando, setReenviando] = useState(false);
  const [emailReenvio, setEmailReenvio] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de confirmação não encontrado.');
      setLoading(false);
      return;
    }

    const confirmar = async () => {
      const result = await authService.confirmarEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage('E-mail confirmado com sucesso! Sua conta está ativada.');
        localStorage.removeItem('pendingConfirmationEmail');
      } else {
        const msg = result.message.toLowerCase();
        if (msg.includes('expirado')) {
          setStatus('expired');
          setMessage('Token expirado. Solicite um novo e-mail de confirmação.');
        } else {
          setStatus('error');
          setMessage(result.message || 'Erro ao confirmar e-mail.');
        }
      }
      setLoading(false);
    };

    confirmar();
  }, [token]);

  const handleReenviar = async () => {
    if (!emailReenvio.trim()) {
      alert('Digite seu e-mail para receber um novo link de confirmação');
      return;
    }
    
    setReenviando(true);
    const result = await authService.reenviarConfirmacao(emailReenvio);
    if (result.success) {
      setStatus(null);
      setMessage('E-mail de confirmação reenviado! Verifique sua caixa de entrada.');
      setEmailReenvio('');
    } else {
      alert(result.message);
    }
    setReenviando(false);
  };

  const handleBackToLogin = () => navigate('/login');

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p>Confirmando seu e-mail...</p>
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
        <h2 className="auth-title">
          {status === 'success' ? 'E-mail Confirmado!' : 'Falha na Confirmação'}
        </h2>
        
        <div className={`alert alert-${status === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>

        {status === 'success' && (
          <>
            <p style={{ marginTop: 16, textAlign: 'center' }}>
              Sua conta foi ativada com sucesso! Agora você pode fazer login.
            </p>
            <button className="btn-primary" onClick={handleBackToLogin}>
              Ir para o login
            </button>
          </>
        )}

        {status === 'expired' && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="emailReenvio">E-mail para reenvio</label>
              <input
                id="emailReenvio"
                className="form-input"
                type="email"
                placeholder="seu@email.com"
                value={emailReenvio}
                onChange={(e) => setEmailReenvio(e.target.value)}
              />
            </div>
            <button 
              className="btn-primary" 
              onClick={handleReenviar} 
              disabled={reenviando || !emailReenvio.trim()}
            >
              {reenviando ? 'Enviando...' : 'Solicitar novo link'}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <p style={{ marginTop: 16, textAlign: 'center' }}>
              Não foi possível confirmar seu e-mail.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent:'center' }}>
              <Link to="/login" className="btn-secondary" style={{backgroundColor: 'var(--gray2)', flexDirection: 'column', textAlign: 'center', textDecoration: 'none', padding: '0.5rem' }}>
                Voltar ao login
              </Link>
              <Link to="/reenviar-confirmacao" className="btn-secondary" style={{ flexDirection: 'column', textAlign: 'center', textDecoration: 'none', padding: '0.5rem' }}>
                Solicitar novo link
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmarEmail;
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import RecuperacaoSenhaService from '../services/RecuperacaoSenhaService';
import PasswordInput from '../components/PasswordInput';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const RedefinirSenha = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [validando, setValidando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [formData, setFormData] = useState({ senha: '', confirmarSenha: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      setValidando(false);
      return;
    }

    const validarToken = async () => {
      const result = await RecuperacaoSenhaService.validarToken(token);
      setTokenValido(result.valido);
      setValidando(false);
      
      if (!result.valido) {
        setMessage({ type: 'error', text: 'Token inválido ou expirado. Solicite uma nova redefinição.' });
      }
    };

    validarToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }
    
    if (formData.senha.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' });
      return;
    }

    setLoading(true);
    const result = await RecuperacaoSenhaService.redefinirSenha(token, formData.senha);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  if (validando) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p>Validando token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="auth-container">
        <button className="auth-back-btn" onClick={() => navigate('/login')}>
          <IconArrowLeft />
        </button>
        <div className="auth-card">
          <h2 className="auth-title">Link Inválido</h2>
          <div className="alert alert-error">
            {message.text || 'Este link de recuperação é inválido ou já expirou.'}
          </div>
          <Link to="/esqueci-senha" className="btn btn-primary btn-block">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={() => navigate('/login')}>
        <IconArrowLeft />
      </button>

      <div className="auth-card">
        <h2 className="auth-title">Redefinir Senha</h2>
        <p className="auth-subtitle">Digite sua nova senha</p>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <PasswordInput
            id="senha"
            name="senha"
            label="Nova Senha"
            placeholder="Mínimo 6 caracteres"
            value={formData.senha}
            onChange={handleChange}
            required
          />
          
          <PasswordInput
            id="confirmarSenha"
            name="confirmarSenha"
            label="Confirmar Nova Senha"
            placeholder="Repita a nova senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
};

export default RedefinirSenha;
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { validators } from '../utils/validators';
import { useNavigate } from 'react-router-dom';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const SignupBarbearia = () => { 
  const navigate = useNavigate();
  const { signupAdmBarbearia } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', telefone: '', email: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.telefone || !formData.confirmPassword) {
      setError('Preencha todos os campos.');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) { setError('Senhas nao coincidem.'); setLoading(false); return; }
    if (!validators.email(formData.email)) { setError('Email invalido.'); setLoading(false); return; }
    if (!validators.password(formData.password)) { setError('Senha: minimo 6 caracteres.'); setLoading(false); return; }
    if (!validators.phone(formData.telefone)) { setError('Telefone invalido.'); setLoading(false); return; }
    if (!validators.name(formData.name)) { setError('Nome: minimo 3 caracteres.'); setLoading(false); return; }

    const result = await signupAdmBarbearia({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      telefone: formData.telefone
    });

    if (result.success) {
      setSuccess('Cadastro realizado! Redirecionando...');
      setTimeout(() => {navigate('/login');}, 2000);
    } else {
      setError(result.error || 'Erro ao cadastrar.');
    }
    setLoading(false);
  };

  const handleBackToHome = () => {navigate('/')};

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={handleBackToHome}>
        <IconArrowLeft />
      </button>

      <div className="auth-card">
        <h2 className="auth-title">Cadastrar Barbearia</h2>
        <p className="auth-subtitle">Cadastre-se como proprietario</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome do proprietario</label>
            <input id="name" className="form-input" type="text" name="name" placeholder="Nome completo" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="telefone">Telefone</label>
            <input id="telefone" className="form-input" type="tel" name="telefone" placeholder="11999999999" value={formData.telefone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input id="password" className="form-input" type="password" name="password" placeholder="Minimo 6 caracteres" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirmar senha</label>
            <input id="confirmPassword" className="form-input" type="password" name="confirmPassword" placeholder="Repita a senha" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Barbearia'}
          </button>
        </form>

        <p className="auth-link">
          Ja e proprietario?
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Fazer Login</a>
        </p>
        <p className="auth-link">
          Quer ser cliente?
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Cadastrar como Cliente</a>
        </p>
      </div>
    </div>
  );
};

export default SignupBarbearia;
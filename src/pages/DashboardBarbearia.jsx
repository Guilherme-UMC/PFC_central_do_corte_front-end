import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import InputFields from '../components/InputFields';

const DashboardBarbearia = () => {
  const { user, logout } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCadastroForm, setShowCadastroForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
    email: '',
    descricao: '',
    horarioAbertura: '',
    horarioFechamento: ''
  });

  // Verificar se o proprietário já tem barbearias cadastradas
  useEffect(() => {
    verificarBarbearias();
  }, []);

  const verificarBarbearias = async () => {
    try {
      setLoading(true);
      // Endpoint correto: /barbearia/my-barbearias
      const response = await api.get('/barbearia/my-barbearias');
      setBarbearias(response.data);
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        // Não encontrou barbearias ou não autorizado
        setBarbearias([]);
      } else {
        console.error('Erro ao buscar barbearias:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Endpoint: /barbearia
      const response = await api.post('/barbearia', formData);
      
      // Adiciona a nova barbearia à lista
      setBarbearias([...barbearias, response.data]);
      setShowCadastroForm(false);
      
      // Limpa o formulário
      setFormData({
        nome: '',
        endereco: '',
        cidade: '',
        uf: '',
        cep: '',
        telefone: '',
        email: '',
        descricao: '',
        horarioAbertura: '',
        horarioFechamento: ''
      });
      
      alert('Barbearia cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar barbearia:', error);
      alert(error.response?.data?.message || 'Erro ao cadastrar barbearia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta barbearia?')) {
      try {
        await api.delete(`/barbearia/${id}`);
        setBarbearias(barbearias.filter(b => b.id !== id));
        alert('Barbearia excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir barbearia:', error);
        alert('Erro ao excluir barbearia. Tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <p style={{ textAlign: 'center' }}>Carregando...</p>
      </div>
    );
  }

  // Se não tem barbearias, mostrar opção de cadastrar
  if (barbearias.length === 0 && !showCadastroForm) {
    return (
      <div className="login-container">
        <h2 className="form-title">Área do Proprietário</h2>
        
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>Bem-vindo, {user?.name}!</p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Você ainda não possui barbearias cadastradas.
          </p>
        </div>

        <button 
          onClick={() => setShowCadastroForm(true)}
          className="login-button"
          style={{ background: '#4CAF50', marginTop: '20px' }}
        >
          Cadastrar Barbearia
        </button>
        
        <button 
          onClick={logout} 
          className="login-button"
          style={{ background: '#f44336', marginTop: '10px' }}
        >
          Sair
        </button>
      </div>
    );
  }

  // Formulário de cadastro de barbearia
  if (showCadastroForm) {
    return (
      <div className="login-container">
        <h2 className="form-title">Cadastrar Barbearia</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Nome da Barbearia *" 
              className="input-field"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <i className="material-symbols-rounded">storefront</i>
          </div>
          
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Endereço *" 
              className="input-field"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
            <i className="material-symbols-rounded">location_on</i>
          </div>
          
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Cidade *" 
              className="input-field"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              required
            />
            <i className="material-symbols-rounded">location_city</i>
          </div>

          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="UF (Ex: SP) *" 
              className="input-field"
              name="uf"
              value={formData.uf}
              onChange={handleChange}
              required
            />
            <i className="material-symbols-rounded">flag</i>
          </div>

          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="CEP" 
              className="input-field"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
            />
            <i className="material-symbols-rounded">mail</i>
          </div>
          
          <div className="input-wrapper">
            <input 
              type="tel" 
              placeholder="Telefone *" 
              className="input-field"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
            <i className="material-symbols-rounded">call</i>
          </div>

          <div className="input-wrapper">
            <input 
              type="email" 
              placeholder="E-mail da Barbearia" 
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <i className="material-symbols-rounded">email</i>
          </div>

          <div className="input-wrapper">
            <input 
              type="time" 
              placeholder="Horário de Abertura" 
              className="input-field"
              name="horarioAbertura"
              value={formData.horarioAbertura}
              onChange={handleChange}
            />
            <i className="material-symbols-rounded">schedule</i>
          </div>

          <div className="input-wrapper">
            <input 
              type="time" 
              placeholder="Horário de Fechamento" 
              className="input-field"
              name="horarioFechamento"
              value={formData.horarioFechamento}
              onChange={handleChange}
            />
            <i className="material-symbols-rounded">schedule</i>
          </div>
          
          <div className="input-wrapper">
            <textarea 
              placeholder="Descrição (opcional)" 
              className="input-field"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
              style={{ paddingTop: '15px', resize: 'vertical', height: '80px' }}
            />
            <i className="material-symbols-rounded">description</i>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Cadastrar Barbearia'}
          </button>
          
          <button 
            type="button"
            onClick={() => setShowCadastroForm(false)}
            className="login-button"
            style={{ background: '#999', marginTop: '10px' }}
          >
            Cancelar
          </button>
        </form>
      </div>
    );
  }

  // Dashboard com barbearias cadastradas
  return (
    <div className="login-container">
      <h2 className="form-title">Minhas Barbearias</h2>
      
      <button 
        onClick={() => setShowCadastroForm(true)}
        className="login-button"
        style={{ background: '#4CAF50', marginBottom: '20px' }}
      >
        + Nova Barbearia
      </button>

      {barbearias.map((barbearia) => (
        <div key={barbearia.id} style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <h3 style={{ marginBottom: '10px' }}>{barbearia.nome}</h3>
          <p>📍 {barbearia.endereco}</p>
          <p>🏙️ {barbearia.cidade} - {barbearia.uf}</p>
          {barbearia.cep && <p>📮 CEP: {barbearia.cep}</p>}
          <p>📞 {barbearia.telefone}</p>
          {barbearia.email && <p>✉️ {barbearia.email}</p>}
          {barbearia.horarioAbertura && barbearia.horarioFechamento && (
            <p>🕐 {barbearia.horarioAbertura} - {barbearia.horarioFechamento}</p>
          )}
          {barbearia.descricao && <p>📝 {barbearia.descricao}</p>}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              className="login-button" 
              style={{ background: '#2196F3', flex: 1 }}
            >
              Gerenciar
            </button>
            <button 
              onClick={() => handleDelete(barbearia.id)}
              className="login-button" 
              style={{ background: '#f44336', flex: 1 }}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={logout} 
        className="login-button"
        style={{ background: '#f44336', marginTop: '10px' }}
      >
        Sair
      </button>
    </div>
  );
};

export default DashboardBarbearia;
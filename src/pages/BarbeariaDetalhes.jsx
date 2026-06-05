import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import barbeariaService from '../services/BarbeariaService';
import servicoService from '../services/ServicoService';
import funcionarioService from '../services/FuncionarioService';
import horarioService, { DIAS_SEMANA } from '../services/HorarioService';
import Loader from '../components/Loader';
import '../styles/pages/barbearia-detalhes.css';

const IconTelefone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconAvatar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
)

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const BarbeariaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCliente } = useAuthContext();

  const [barbearia, setBarbearia] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('servicos');

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const barbeariaResult = await barbeariaService.buscarPorId(id);
      if (barbeariaResult.success) setBarbearia(barbeariaResult.data);

      const servicosResult = await servicoService.listarPorBarbearia(id);
      if (servicosResult.success) setServicos(servicosResult.data);

      const funcionariosResult = await funcionarioService.listarPorBarbearia(id);
      if (funcionariosResult.success) setFuncionarios(funcionariosResult.data);

      const horariosResult = await horarioService.getHorarios(id);
      if (horariosResult.success && horariosResult.data) {
        setHorarios(horariosResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendar = () => {
    if (isAuthenticated && isCliente) {
      navigate('/page/cliente', { state: { barbeariaId: id } });
    } else {
      navigate('/login', { state: { from: `/barbearia/${id}` } });
    }
  };

  if (loading) return <Loader />;
  if (!barbearia) return <div className="error-state">Barbearia não encontrada</div>;

  return (
    <div className="barbearia-detalhes">
      <div className="barbearia-detalhes-container">
        <button className="btn-voltar" onClick={() => navigate('/')}><IconArrowLeft/></button>

        {/* Cabeçalho */}
        <div className="barbearia-detalhes-header">
          {barbearia.imgUrl ? (
            <img src={barbearia.imgUrl} alt={barbearia.nome} />
          ) : (
            <div className="placeholder-img">✂️</div>
          )}
          <div className='barberia-dados'>
            <h1>{barbearia.nome}</h1>
            <p>{barbearia.logradouro}, {barbearia.numero} - {barbearia.bairro}</p>
            <p>{barbearia.cidade} - {barbearia.uf} | CEP: {barbearia.cep}</p>
            {barbearia.telefone && <p> <IconTelefone /> {barbearia.telefone}</p>}
            <button className="btn-agendar-principal" onClick={handleAgendar}>
              AGENDAR
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={activeTab === 'servicos' ? 'active' : ''} onClick={() => setActiveTab('servicos')}>
            Serviços ({servicos.length})
          </button>
          <button className={activeTab === 'funcionarios' ? 'active' : ''} onClick={() => setActiveTab('funcionarios')}>
            Profissionais ({funcionarios.length})
          </button>
          <button className={activeTab === 'horarios' ? 'active' : ''} onClick={() => setActiveTab('horarios')}>
            Horários
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="tab-content">
          {activeTab === 'servicos' && (
            <div className="servicos-lista">
              {servicos.map(s => (
                <div key={s.id} className="servico-card">
                  <h4>{s.nome}</h4>
                  {s.descricao && <p>{s.descricao}</p>}
                  <div>
                    <span>R$ {s.preco?.toFixed(2)}</span>
                    <span>{s.duracaoMinutos} min</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'funcionarios' && (
            <div className="funcionarios-lista">
              {funcionarios.map(f => (
                <div key={f.id} className="funcionario-card">
                  <div className="avatar"><IconAvatar/></div>
                  <div>
                    <h4>{f.name}</h4>
                    {f.telefone && <p>{f.telefone}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'horarios' && (
            <div className="horarios-lista">
              {DIAS_SEMANA.map(dia => {
                const horario = horarios.find(h => h.dia === dia.value);
                return (
                  <div key={dia.value} className="horario-item">
                    <strong>{dia.label}</strong>
                    <span>{horario?.fechado ? 'Fechado' : `${horario?.horaAbertura || '09:00'} - ${horario?.horaFechamento || '18:00'}`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarbeariaDetalhes;
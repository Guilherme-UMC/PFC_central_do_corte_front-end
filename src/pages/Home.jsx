import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useSearch } from '../layouts/RootLayout';
import barbeariaService from '../services/BarbeariaService';
import servicoService from '../services/ServicoService';
import BarberCard from '../components/BarberCard';
import BarbeariaImg from '../img/cadastre-barbearia.png';
import ClienteImg from '../img/cadastre-cliente.png';
import { 
  IconScissors, 
  IconBeard, 
  IconPaint, 
  IconEyebrow, 
  IconOthers 
} from '../components/Icons';
import { CATEGORIAS_SERVICO, getCategoriaLabel } from '../services/categoriaServico';
import '../styles/pages/home.css';

const IconSpray = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <rect x="3" y="10" width="10" height="11" rx="2" /><path d="M13 14h3a2 2 0 0 0 0-4h-3" />
    <path d="M7 10V7" /><path d="M5 7h4" /><circle cx="18" cy="5" r="1" /><circle cx="21" cy="8" r="1" />
    <circle cx="20" cy="3" r="1" />
  </svg>
);

const getIconForCategory = (categoriaValue) => {
  const icons = {
    'CORTE': IconScissors,
    'BARBA': IconBeard,
    'CABELO_E_BARBA': IconScissors,
    'QUIMICA': IconSpray,
    'TINTURA': IconPaint,
    'SOBRANCELHA': IconEyebrow,
    'OUTROS': IconOthers
  };
  return icons[categoriaValue] || IconScissors;
};

const SERVICOS_LISTA = CATEGORIAS_SERVICO.map(cat => ({
  nome: cat.label,
  Icon: getIconForCategory(cat.value),
  key: cat.value
}));

const SectionHeader = ({ title, side = 'left' }) => (
  <div className={`section-header section-header--${side}`}>
    <div className="section-title-box"><span>{title}</span></div>
  </div>
);

const ActiveFilters = ({ search, servicoAtivo, onClearSearch, onClearServico }) => {
  if (!search.trim() && !servicoAtivo) return null;
  return (
    <div className="active-filters">
      {search.trim() && (
        <span className="filter-chip">
          Busca: {search}
          <button onClick={onClearSearch} aria-label="Remover filtro"><IconX /></button>
        </span>
      )}
      {servicoAtivo && (
        <span className="filter-chip filter-chip--service">
          Serviço: {getCategoriaLabel(servicoAtivo)}
          <button onClick={onClearServico} aria-label="Remover filtro"><IconX /></button>
        </span>
      )}
    </div>
  );
};

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isCliente } = useAuthContext();
  const { search, setSearch } = useSearch();

  const [servicoAtivo, setServicoAtivo] = useState(null);
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const sliderRef = useRef(null);

  const carregarBarbearias = async () => {
    try {
      setLoading(true);
      const result = await barbeariaService.listarTodas(0, 50);
      if (result.success) {
        const data = result.data;
        const lista = data.content || data || [];
        setBarbearias(lista);
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarBarbeariasPorCategoria = async (categoria) => {
    try {
      setLoadingCategoria(true);
      const result = await servicoService.buscarBarbeariasPorCategoria(categoria);
      if (result.success) {
        setBarbearias(result.data || []);
      } else {
        setBarbearias([]);
      }
    } catch (error) {
      console.error('Erro ao buscar barbearias por categoria:', error);
      setBarbearias([]);
    } finally {
      setLoadingCategoria(false);
    }
  };

  useEffect(() => {
    carregarBarbearias();
  }, []);

  useEffect(() => {
    if (servicoAtivo) {
      buscarBarbeariasPorCategoria(servicoAtivo);
    } else {
      carregarBarbearias();
    }
  }, [servicoAtivo]);

  const barbeariasFiltradas = barbearias.filter((b) => {
    if (!search.trim()) return true;
    
    const termo = search.toLowerCase();
    
    const isCep = /^\d{5}-?\d{3}$/.test(termo);
    if (isCep) {
      const cepLimpo = termo.replace(/\D/g, '');
      const cepBarbearia = b.cep?.replace(/\D/g, '');
      return cepBarbearia === cepLimpo;
    }
    
    const campos = [b.nome, b.cidade, b.bairro, b.logradouro, b.uf]
      .map(v => (v || '').toLowerCase());
    return campos.some(c => c.includes(termo));
  });

  const handleServicoClick = (key) => {
    if (servicoAtivo === key) {
      setServicoAtivo(null);
      if (search) setSearch('');
    } else {
      setServicoAtivo(key);
      if (search) setSearch('');
    }

    setTimeout(() => {
      document.getElementById('barbearias')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAgendar = (barbeariaId) => {
    navigate(`/barbearia/${barbeariaId}`);
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  const isFiltrado = search.trim() || servicoAtivo;
  const servicoSelecionadoNome = getCategoriaLabel(servicoAtivo);
  const isLoading = loading || loadingCategoria;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__left">
          <h1 className="hero__title">Central do<br />Corte</h1>
          <p className="hero__subtitle">A CENTRAL DAS BARBEARIAS</p>
        </div>
      </section>

      {/* Barbearias Section */}
      <section className="home-section" id="barbearias">
        <SectionHeader title="BARBEARIAS" side="left" />
        <div className="secao">
          <div className="barbearias-header">
            <p className="section-lead">
              {isFiltrado
                ? `${barbeariasFiltradas.length} resultado${barbeariasFiltradas.length !== 1 ? 's' : ''} encontrado${barbeariasFiltradas.length !== 1 ? 's' : ''}`
                : 'Encontre barbearias da sua região'}
            </p>
            <ActiveFilters
              search={search}
              servicoAtivo={servicoAtivo}
              onClearSearch={() => setSearch('')}
              onClearServico={() => setServicoAtivo(null)}
            />
          </div>

          {isLoading ? (
            <div className="cards-loading">
              {[1, 2, 3].map(i => (
                <div key={i} className="barber-card barber-card--skeleton">
                  <div className="skeleton skeleton--img" />
                  <div className="barber-card__body">
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--text" />
                    <div className="skeleton skeleton--btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : barbeariasFiltradas.length === 0 ? (
            <div className="empty-barbearias">
              <IconScissors size={48} />
              <p>
                {isFiltrado
                  ? servicoAtivo
                    ? `Nenhuma barbearia encontrada com o serviço "${servicoSelecionadoNome}".`
                    : 'Nenhuma barbearia encontrada para este filtro.'
                  : 'Nenhuma barbearia cadastrada ainda.'}
              </p>
              {isFiltrado && (
                <button
                  className="btn-limpar-filtros"
                  onClick={() => { setSearch(''); setServicoAtivo(null); }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="slider-wrap">
              <div className="cards-slider" ref={sliderRef}>
                {barbeariasFiltradas.map(b => (
                  <BarberCard
                    key={b.id}
                    barbearia={b}
                    onAgendarClick={handleAgendar}
                  />
                ))}
              </div>
              {barbeariasFiltradas.length > 3 && (
                <button className="slider-arrow" onClick={scrollRight} aria-label="Próximo">
                  <IconChevronRight />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Serviços Section */}
      <section className="home-section services-section" id="servicos">
        <SectionHeader title="SERVIÇOS" side="right" />
        <div className="secao">
          <p className="section-lead">
            {servicoAtivo
              ? `Filtrando por: ${servicoSelecionadoNome} — Clique novamente para remover o filtro`
              : 'Clique em um serviço para filtrar barbearias'}
          </p>
          <div className="services-grid">
            {SERVICOS_LISTA.map(({ nome, Icon, key }) => (
              <button
                key={key}
                className={`service-item ${servicoAtivo === key ? 'service-item--active' : ''}`}
                onClick={() => handleServicoClick(key)}
              >
                <div className="service-item__icon"><Icon /></div>
                <span>{nome}</span>
                {servicoAtivo === key && <span className="service-item__badge">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Agendamentos Section */}
      <section className="home-section agendamentos-section" id="agendamentos">
        <SectionHeader title="AGENDAMENTOS" side="left" />
        <div className="secao">
          <div className="agendamentos-body">
            <img src={ClienteImg} alt="cadastre-cliente" className='homeImg' />
            <div />
            <div className="agendamentos-right">
              <p>
                <strong>Agende com facilidade!</strong><br />
              </p>
              <p>
                Escolha a barbearia, o profissional e o serviço<br />
                que mais combinam com você.<br />
                Agende em poucos cliques,
                no seu tempo <br />e sem complicação!
              </p>
              <button className="btn-virar" onClick={() => navigate('/login')}>
                VIRAR CLIENTE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cadastro Section */}
      <section className="home-section cadastro-section" id="cadastro">
        <SectionHeader title="CADASTRE SUA BARBEARIA" />
        <div className="secao">
          <div className="cadastro-body">
            <img src={BarbeariaImg} alt="cadastre-barbearia" className='homeImg' />
            <div className="cadastro-text">
              <p><strong>Cadastre sua barbearia e aumente seus agendamentos.</strong></p>
              <p>
                Melhore o gerenciamento do seu negócio,
                possuímos um módulo administrativo com
                todos os registros de agendamentos e
                serviços oferecidos e funcionários
                registrados no seu estabelecimento!
              </p>
              <button className="btn-cadastrar" onClick={() => navigate('/signup-barbearia')}>
                CADASTRAR BARBEARIA
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
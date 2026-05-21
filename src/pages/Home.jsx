import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useSearch } from '../layouts/RootLayout';
import barbeariaService from '../services/BarbeariaService';

const IconScissors = ({ size = 36 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconPaint = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <path d="M2 13.5A9 9 0 1 0 13.5 2" /><path d="M8 12a4 4 0 1 0 4-4" /><circle cx="20" cy="20" r="2" />
  </svg>
);
const IconBeard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <path d="M4 6c0 0 1 9 8 9s8-9 8-9" /><path d="M4 6 L4 4 Q12 2 20 4 L20 6" />
    <path d="M9 15 Q12 20 15 15" />
  </svg>
);
const IconChildCut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <circle cx="12" cy="7" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    <path d="M9 7 Q12 5 15 7" />
  </svg>
);
const IconSpray = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <rect x="3" y="10" width="10" height="11" rx="2" /><path d="M13 14h3a2 2 0 0 0 0-4h-3" />
    <path d="M7 10V7" /><path d="M5 7h4" /><circle cx="18" cy="5" r="1" /><circle cx="21" cy="8" r="1" />
    <circle cx="20" cy="3" r="1" />
  </svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L.057 23.882l6.196-1.451A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374A9.861 9.861 0 0 1 2.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SERVICOS_LISTA = [
  { nome: 'Corte', Icon: IconScissors, key: 'corte' },
  { nome: 'Tintura', Icon: IconPaint, key: 'tintura' },
  { nome: 'Barba', Icon: IconBeard, key: 'barba' },
  { nome: 'Corte Infantil', Icon: IconChildCut, key: 'infantil' },
  { nome: 'Quimica', Icon: IconSpray, key: 'quimica' },
];

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
          Busca: "{search}"
          <button onClick={onClearSearch} aria-label="Remover filtro"><IconX /></button>
        </span>
      )}
      {servicoAtivo && (
        <span className="filter-chip filter-chip--service">
          Servico: {SERVICOS_LISTA.find(s => s.key === servicoAtivo)?.nome}
          <button onClick={onClearServico} aria-label="Remover filtro"><IconX /></button>
        </span>
      )}
    </div>
  );
};

const BarberCard = ({ b, onAgendar }) => (
  <div className="barber-card">
    <div className="barber-card__img-wrap">
      <img
        src={b.imgUrl || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop'}
        alt={b.nome}
        className="barber-card__img"
      />
      {b.telefone && (
        <a
          href={`https://wa.me/55${b.telefone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="barber-card__wa"
          aria-label="WhatsApp"
          onClick={e => e.stopPropagation()}
        >
          <IconWhatsApp />
        </a>
      )}
    </div>
    <div className="barber-card__body">
      <h3 className="barber-card__name">{b.nome}</h3>

      {/* Endereço completo */}
      <p className="barber-card__addr">
        <span><IconPin /> {b.logradouro}{b.numero ? `, ${b.numero}` : ''}</span>
        {b.bairro && <span style={{ paddingLeft: '18px' }}>{b.bairro}</span>}
        <span style={{ paddingLeft: '18px' }}>{b.cidade} - {b.uf}</span>
        {b.cep && <span style={{ paddingLeft: '18px' }}>CEP: {b.cep}</span>}
      </p>

      {/* Telefone visível diretamente no card */}
      {b.telefone && (
        <p className="barber-card__phone">
          <IconPhone /> {b.telefone}
        </p>
      )}

      {/* Serviços que casaram com o filtro */}
      {b._servicosMatch && (
        <div className="barber-card__servicos">
          {b._servicosMatch.map(s => (
            <span key={s.id} className="servico-tag">{s.nome}</span>
          ))}
        </div>
      )}

      <button className="btn-agendar" onClick={() => onAgendar(b.id)}>
        AGENDAR
      </button>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isCliente } = useAuthContext();
  const { search, setSearch } = useSearch();

  const [servicoAtivo, setServicoAtivo] = useState(null);
  const [barbearias, setBarbearias] = useState([]);
  const [servicosPorBarbearia, setServicoPorBarbearia] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const carregarBarbearias = async () => {
      try {
        setLoading(true);
        const result = await barbeariaService.listarTodas(0, 50);
        if (result.success) {
          const data = result.data;
          const lista = data.content || data || [];
          setBarbearias(lista);
        }
      } finally {
        setLoading(false);
      }
    };
    carregarBarbearias();
  }, []);

  useEffect(() => {
    if (!servicoAtivo || barbearias.length === 0) return;

    const buscarServicos = async () => {
      setLoadingServicos(true);
      const mapa = {};
      await Promise.all(
        barbearias.map(async (b) => {
          try {
            const res = await fetch(`http://localhost:8080/api/servicos/barbearia/${b.id}`, {
              headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
              const data = await res.json();
              mapa[b.id] = Array.isArray(data) ? data : (data.content || []);
            }
          } catch (_) {
            mapa[b.id] = [];
          }
        })
      );
      setServicoPorBarbearia(mapa);
      setLoadingServicos(false);
    };

    buscarServicos();
  }, [servicoAtivo, barbearias]);

  const barbeariasFiltradas = barbearias
    .map((b) => {
      if (search.trim()) {
        const termo = search.toLowerCase();
        const campos = [b.nome, b.cidade, b.bairro, b.logradouro, b.uf]
          .map(v => (v || '').toLowerCase());
        const textoMatch = campos.some(c => c.includes(termo));
        const servicosB = servicosPorBarbearia[b.id] || [];
        const servicoTextoMatch = servicosB.some(s =>
          (s.nome || '').toLowerCase().includes(termo)
        );
        if (!textoMatch && !servicoTextoMatch) return null;
      }

      if (servicoAtivo) {
        const servicosB = servicosPorBarbearia[b.id] || [];
        const matches = servicosB.filter(s =>
          (s.nome || '').toLowerCase().includes(servicoAtivo)
        );
        if (matches.length === 0) return null;
        return { ...b, _servicosMatch: matches };
      }

      return b;
    })
    .filter(Boolean);

  const handleServicoClick = (key) => {
    setServicoAtivo(prev => prev === key ? null : key);
    setTimeout(() => {
      document.getElementById('barbearias')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAgendar = (barbeariaId) => {
    if (isAuthenticated && isCliente) {
      navigate('/dashboard/cliente', { state: { barbeariaId } });
    } else if (isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  const isFiltrado = search.trim() || servicoAtivo;

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__left">
          <h1 className="hero__title">Central do<br />Corte</h1>
          <p className="hero__subtitle">A CENTRAL DAS BARBEARIAS</p>
        </div>
      </section>

      {/* Barbearias */}
      <section className="home-section" id="barbearias">
        <SectionHeader title="BARBEARIAS" side="left" />
        <div className="secao">
          <div className="barbearias-header">
            <p className="section-lead">
              {isFiltrado
                ? `${barbeariasFiltradas.length} resultado${barbeariasFiltradas.length !== 1 ? 's' : ''} encontrado${barbeariasFiltradas.length !== 1 ? 's' : ''}`
                : 'Encontre barbearias da sua regiao'}
            </p>
            <ActiveFilters
              search={search}
              servicoAtivo={servicoAtivo}
              onClearSearch={() => setSearch('')}
              onClearServico={() => setServicoAtivo(null)}
            />
          </div>

          {loading || loadingServicos ? (
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
                  ? 'Nenhuma barbearia encontrada para este filtro.'
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
                  <BarberCard key={b.id} b={b} onAgendar={handleAgendar} />
                ))}
              </div>
              {barbeariasFiltradas.length > 3 && (
                <button className="slider-arrow" onClick={scrollRight} aria-label="Proximo">
                  <IconChevronRight />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Serviços */}
      <section className="home-section services-section" id="servicos">
        <SectionHeader title="SERVICOS" side="right" />
        <div className="secao">
          <p className="section-lead">
            {servicoAtivo
              ? 'Clique novamente para remover o filtro'
              : 'Clique em um servico para filtrar barbearias'}
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

      {/* Agendamentos CTA */}
      <section className="home-section agendamentos-section" id="agendamentos">
        <SectionHeader title="AGENDAMENTOS" side="left" />
        <div className="secao">
          <div className="agendamentos-body">
            <div />
            <div className="agendamentos-right">
              <p>
                Agende no seu tempo, na sua barbearia<br />
                favorita e com seu funcionario e servico de<br />
                escolha!
              </p>
              <button className="btn-virar" onClick={() => navigate('/login')}>
                VIRAR CLIENTE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cadastro barbearia CTA */}
      <section className="home-section cadastro-section" id="cadastro">
        <SectionHeader title="CADASTRE SUA BARBEARIA" />
        <div className="secao">
          <div className="cadastro-body">
            <div className="cadastro-text">
              <p><strong>Cadastre sua barbearia e aumente seus agendamentos.</strong></p>
              <p>
                Melhore o gerenciamento do seu negocio,
                possuimos um modulo administrativo com
                todos os registros de agendamentos e
                servicos oferecidos e funcionarios
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
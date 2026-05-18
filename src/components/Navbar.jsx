import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
 
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
 
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
 
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
 
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
 
const IconScissors = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);
 
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
 
const Navbar = ({ search, onSearchChange }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isBarbeariaAdm, isCliente, logout } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };
 
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };
 
  const goToSection = (sectionId) => {
    setMenuOpen(false);
    // Se não estiver na home, navega primeiro
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };
 
  // Retorna o caminho do dashboard conforme o role — sem efeito colateral de navigate
  const getDashboardPath = () => {
    if (isBarbeariaAdm) return '/dashboard/barbearia';
    if (isCliente) return '/dashboard/cliente';
    return '/dashboard/funcionario';
  };
 
  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <div className="navbar__logo" onClick={() => goTo('/')}>
          <div className="navbar__logo-icon"><IconScissors /></div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-title">Central do Corte</span>
          </div>
        </div>
 
        {/* Busca desktop — atualiza estado no RootLayout, consumido pela Home */}
        <div className={`navbar__search ${searchExpanded ? 'navbar__search--expanded' : ''}`}>
          <IconSearch />
          <input
            value={search || ''}
            onChange={e => {
              onSearchChange && onSearchChange(e.target.value);
              // Se não estiver na home, navega para lá para mostrar resultados
              if (window.location.pathname !== '/') navigate('/');
            }}
            placeholder="Buscar barbearias ou servicos"
            onFocus={() => setSearchExpanded(true)}
            onBlur={() => setSearchExpanded(false)}
          />
        </div>
 
        <div className="navbar__links">
          <button onClick={() => goToSection('barbearias')} className="navbar__link">Barbearias</button>
          <button onClick={() => goToSection('servicos')} className="navbar__link">Servicos</button>
          <button onClick={() => goToSection('agendamentos')} className="navbar__link">Agendamentos</button>
          <button onClick={() => goToSection('cadastro')} className="navbar__link">Cadastro</button>
        </div>
 
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__user-menu">
              {/* Botão de perfil → /perfil */}
              <button className="navbar__user-btn" onClick={() => goTo('/perfil')}>
                <IconUser />
                <span>{user?.name?.split(' ')[0] || 'Conta'}</span>
              </button>
              {/* Botão de logout */}
              <button className="navbar__logout-btn" onClick={handleLogout} title="Sair">
                <IconLogout />
              </button>
            </div>
          ) : (
            <>
              <button className="btn-nav btn-nav--outline" onClick={() => goTo('/login')}>
                Entrar
              </button>
              <button className="btn-nav btn-nav--filled" onClick={() => goTo('/signup')}>
                Cadastrar
              </button>
            </>
          )}
        </div>
 
        <button
          className="navbar__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>
 
      {/* Busca mobile */}
      <div className="navbar__search-mobile">
        <IconSearch />
        <input
          value={search || ''}
          onChange={e => {
            onSearchChange && onSearchChange(e.target.value);
            if (window.location.pathname !== '/') navigate('/');
          }}
          placeholder="Buscar barbearias..."
        />
      </div>
 
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-links">
          <button onClick={() => goToSection('barbearias')} className="navbar__mobile-link">Barbearias</button>
          <button onClick={() => goToSection('servicos')} className="navbar__mobile-link">Servicos</button>
          <button onClick={() => goToSection('agendamentos')} className="navbar__mobile-link">Agendamentos</button>
          <button onClick={() => goToSection('cadastro')} className="navbar__mobile-link">Cadastro</button>
        </div>
 
        <div className="navbar__mobile-actions">
          {isAuthenticated ? (
            <>
              <button className="navbar__mobile-link" onClick={() => goTo(getDashboardPath())}>
                Meu Painel
              </button>
              <button className="navbar__mobile-link" onClick={() => goTo('/perfil')}>
                Meu Perfil
              </button>
              <button className="navbar__mobile-link" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button className="btn-nav btn-nav--filled btn-nav--full" onClick={() => goTo('/login')}>
                Entrar
              </button>
              <button className="btn-nav btn-nav--outline btn-nav--full" onClick={() => goTo('/signup')}>
                Cadastrar
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
 
export default Navbar;
 
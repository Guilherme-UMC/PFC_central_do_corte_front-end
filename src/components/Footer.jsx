// src/components/Footer.jsx - VERSÃO REACT ROUTER DOM
import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L.057 23.882l6.196-1.451A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374A9.861 9.861 0 0 1 2.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z"/>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__col">
          <h3 className="footer__title">Central do Corte</h3>
          <p className="footer__text">A central das barbearias.</p>
          <p className="footer__text">
            Conectando clientes aos melhores<br />
            profissionais da sua regiao.
          </p>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Navegacao</h3>
          <div className="footer__links">
            <button onClick={() => scrollToSection('barbearias')} className="footer__link">Inicio</button>
            <button onClick={() => handleNavigate('/login')} className="footer__link">Entrar</button>
            <button onClick={() => handleNavigate('/signup')} className="footer__link">Cadastrar Usuário</button>
            <button onClick={() => handleNavigate('/signup-barbearia')} className="footer__link">Cadastrar Barbearia</button>
          </div>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Contato</h3>
          <div className="footer__contact">
            <p className="footer__contact-item">
              <IconWhatsApp />
              <span>(11) 9****-****</span>
            </p>
            <p className="footer__contact-item">
              <IconMail />
              <span>suporte.centraldocorte@gmail.com</span>
            </p>
            <p className="footer__contact-item">
              <IconPin />
              <span>Mogi das Cruzes - SP</span>
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-content">
          <p>
            Projeto de Finalização de Curso - Central do Corte 2026 - Todos os direitos reservados
          </p>
          <p className="footer__credits">
            Desenvolvido por Bruna Santos e Guilherme Matos
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
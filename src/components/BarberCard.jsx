import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import '../styles/components/barber-card.css';

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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const BarberCard = ({ barbearia, onAgendarClick, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/barbearia/${barbearia.id}`);
  };

  const handleAgendarClick = (e) => {
    e.stopPropagation();
    if (onAgendarClick) {
      onAgendarClick(barbearia.id);
    }
  };

  return (
    <div className="barber-card" onClick={handleCardClick}>
      <div className="barber-card__img-wrap">
        <img
          src={barbearia.imgUrl || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop'}
          alt={barbearia.nome}
          className="barber-card__img"
        />
        {barbearia.telefone && (
          <a
            href={`https://wa.me/55${barbearia.telefone.replace(/\D/g, '')}`}
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
        <h3 className="barber-card__name">{barbearia.nome}</h3>

        <p className="barber-card__addr">
          <span><IconPin /> {barbearia.logradouro}{barbearia.numero ? `, ${barbearia.numero}` : ''}</span>
          {barbearia.bairro && <span>{barbearia.bairro}</span>}
          <span>{barbearia.cidade} - {barbearia.uf}</span>
          {barbearia.cep && <span>CEP: {barbearia.cep}</span>}
        </p>

        {barbearia.telefone && (
          <p className="barber-card__phone">
            <IconPhone /> {barbearia.telefone}
          </p>
        )}

        {barbearia._servicosMatch && barbearia._servicosMatch.length > 0 && (
          <div className="barber-card__servicos">
            {barbearia._servicosMatch.map(s => (
              <span key={s.id} className="servico-tag">{s.nome}</span>
            ))}
          </div>
        )}

        <button className="btn-agendar" onClick={handleAgendarClick}>
          AGENDAR
        </button>
      </div>
    </div>
  );
};

export default BarberCard;
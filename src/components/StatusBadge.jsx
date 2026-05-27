import React from 'react';

const STATUS_CONFIG = {
  PENDENTE: { label: 'Aguardando confirmação', className: 'status-badge status-badge--pending' },
  CONFIRMADO: { label: 'Confirmado', className: 'status-badge status-badge--confirmed' },
  CANCELADO_PELO_CLIENTE: { label: 'Cancelado por você', className: 'status-badge status-badge--cancelled' },
  CANCELADO_PELA_BARBEARIA: { label: 'Cancelado pela barbearia', className: 'status-badge status-badge--cancelled' },
  CONCLUIDO: { label: 'Concluído', className: 'status-badge status-badge--finished' },
  NAO_COMPARECEU: { label: 'Não compareceu', className: 'status-badge status-badge--missed' }
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDENTE;
  
  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
// src/components/StatusBadge.jsx
import React from 'react';

const STATUS_CONFIG = {
  AGENDADO: { label: 'Agendado', className: 'status-badge status-badge--pending' },
  CONFIRMADO: { label: 'Confirmado', className: 'status-badge status-badge--confirmed' },
  CANCELADO: { label: 'Cancelado', className: 'status-badge status-badge--cancelled' },
  FINALIZADO: { label: 'Finalizado', className: 'status-badge status-badge--finished' }
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.AGENDADO;
  
  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
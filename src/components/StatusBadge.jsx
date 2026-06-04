import React from 'react';

const STATUS_CONFIG = {
  // Status em PORTUGUÊS (como vem do backend)
  'Aguardando confirmação': { label: 'Aguardando confirmação', className: 'status-badge status-badge--pending' },
  'Confirmado': { label: 'Confirmado', className: 'status-badge status-badge--confirmed' },
  'Cancelado pelo cliente': { label: 'Cancelado por você', className: 'status-badge status-badge--cancelled' },
  'Cancelado pela barbearia': { label: 'Cancelado pela barbearia', className: 'status-badge status-badge--cancelled' },
  'Concluído': { label: 'Concluído', className: 'status-badge status-badge--finished' },
  'Não compareceu': { label: 'Não compareceu', className: 'status-badge status-badge--missed' },
  
  // Mantém também os em INGLÊS para compatibilidade (caso mude depois)
  PENDENTE: { label: 'Aguardando confirmação', className: 'status-badge status-badge--pending' },
  CONFIRMADO: { label: 'Confirmado', className: 'status-badge status-badge--confirmed' },
  CANCELADO_PELO_CLIENTE: { label: 'Cancelado por você', className: 'status-badge status-badge--cancelled' },
  CANCELADO_PELA_BARBEARIA: { label: 'Cancelado pela barbearia', className: 'status-badge status-badge--cancelled' },
  CONCLUIDO: { label: 'Concluído', className: 'status-badge status-badge--finished' },
  NAO_COMPARECEU: { label: 'Não compareceu', className: 'status-badge status-badge--missed' }
};

const StatusBadge = ({ status }) => {
  // Garantir que status é string
  const statusStr = String(status || '');
  const config = STATUS_CONFIG[statusStr] || STATUS_CONFIG['Aguardando confirmação'];
  
  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
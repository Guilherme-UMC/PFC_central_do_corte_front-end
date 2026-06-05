import React from 'react';
import '../styles/components/dashboard-card.css';

const DashboardCard = ({ title, value, icon, color, subtitle, onClick }) => {
  return (
    <div className="dashboard-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="dashboard-card-header">
        <div className="dashboard-card-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-title">{title}</span>
          <span className="dashboard-card-value">{value}</span>
          {subtitle && <span className="dashboard-card-subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
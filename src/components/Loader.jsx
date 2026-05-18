// src/components/Loader.jsx
import React from 'react';

const Loader = ({ size = 40, color = '#1a1a1a' }) => {
  return (
    <div className="loader-container">
      <div 
        className="loader"
        style={{
          width: size,
          height: size,
          border: `3px solid ${color}20`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Loader;
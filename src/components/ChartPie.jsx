import React, { useEffect, useRef } from 'react';

const ChartPie = ({ data, labels, title, colors }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !labels) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = Math.min(canvas.parentElement.clientWidth, 250);
    
    canvas.width = size;
    canvas.height = size;
    
    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;
    
    const total = data.reduce((acc, val) => acc + val, 0);
    let startAngle = -Math.PI / 2;
    
    const defaultColors = ['#d4af37', '#2e7d32', '#c62828', '#1e88e5', '#e67e22', '#9b59b6'];
    
    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.fillStyle = (colors && colors[i]) || defaultColors[i % defaultColors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fill();
      
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      startAngle = endAngle;
    }
    
    ctx.fillStyle = '#f0ece4';
    ctx.font = 'bold 14px DM Sans';
    ctx.fillText(title, 10, 25);
    
  }, [data, labels, title, colors]);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block' }} />
      <div className="chart-legend">
        {labels.map((label, i) => (
          <div key={i} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: `hsl(${i * 40}, 70%, 50%)` }}></span>
            <span className="legend-label">{label}</span>
            <span className="legend-value">{data[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartPie;
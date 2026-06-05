import React, { useEffect, useRef } from 'react';

const ChartBar = ({ data, labels, title, height = 300 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !labels) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const barWidth = (width - 80) / (data.length * 1.5);
    const maxValue = Math.max(...data, 1);
    
    canvas.width = width;
    canvas.height = height;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Fundo escuro
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Desenhar barras
    for (let i = 0; i < data.length; i++) {
      const x = 40 + i * (barWidth + 20);
      const barHeight = (data[i] / maxValue) * (height - 80);
      const y = height - 40 - barHeight;
      
      // Gradiente
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, '#d4af37');
      gradient.addColorStop(1, '#c9a84c');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Valor no topo da barra
      ctx.fillStyle = '#f0ece4';
      ctx.font = '12px DM Sans';
      ctx.fillText(data[i], x + barWidth / 2 - 10, y - 5);
      
      // Label abaixo da barra
      ctx.fillStyle = '#8a8278';
      ctx.font = '11px DM Sans';
      ctx.fillText(labels[i], x + barWidth / 2 - 15, height - 20);
    }
    
    // Título
    ctx.fillStyle = '#f0ece4';
    ctx.font = 'bold 14px DM Sans';
    ctx.fillText(title, 20, 25);
    
  }, [data, labels, title, height]);

  return (
    <div className="chart-container" style={{ width: '100%', overflowX: 'auto' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px`, borderRadius: '12px' }} />
    </div>
  );
};

export default ChartBar;
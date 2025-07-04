import React, { useState, useEffect, useId, useRef } from 'react';

interface WaterTankIndicatorProps {
  percentage: number;
  id?: string; 
}

export const WaterTankIndicator = ({ percentage, id }: WaterTankIndicatorProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [waveTick, setWaveTick] = useState(0);
  
  const uniqueId = useId();
  const tankId = id || uniqueId;
  
  // Refs para controlar los intervalos
  const percentageAnimationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveTickInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const waterGradientId = `waterGradient-${tankId}`;
  const tankGradientId = `tankGradient-${tankId}`;
  const glowId = `glow-${tankId}`;
  
  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (percentageAnimationInterval.current) {
      clearInterval(percentageAnimationInterval.current);
      percentageAnimationInterval.current = null;
    }
    
    const duration = 1500; 
    const interval = 10; 
    const steps = duration / interval;
    const increment = percentage / steps;
    let currentPercentage = 0;
    
    percentageAnimationInterval.current = setInterval(() => {
      currentPercentage += increment;
      if (currentPercentage >= percentage) {
        if (percentageAnimationInterval.current) {
          clearInterval(percentageAnimationInterval.current);
          percentageAnimationInterval.current = null;
        }
        setAnimatedPercentage(percentage);
      } else {
        setAnimatedPercentage(currentPercentage);
      }
    }, interval);
    
    return () => {
      if (percentageAnimationInterval.current) {
        clearInterval(percentageAnimationInterval.current);
        percentageAnimationInterval.current = null;
      }
    };
  }, [percentage]);
  
  useEffect(() => {
    // Configurar el intervalo para la onda solo una vez en el montaje
    if (waveTickInterval.current === null) {
      waveTickInterval.current = setInterval(() => {
        setWaveTick(prev => (prev + 1) % 100);
      }, 100);
    }
    
    return () => {
      if (waveTickInterval.current) {
        clearInterval(waveTickInterval.current);
        waveTickInterval.current = null;
      }
    };
  }, []);

  const getFillColor = (level: number) => {
    if (level > 50) return '#22c55e'; 
    if (level > 25) return '#eab308'; 
    return '#ef4444'; 
  };

  const getGradient = (level: number) => {
    if (level > 50) return ['#22c55e', '#16a34a']; 
    if (level > 25) return ['#eab308', '#ca8a04']; 
    return ['#ef4444', '#dc2626']; 
  };

  const getStatusText = (level: number) => {
    if (level > 75) return 'Nivel Óptimo';
    if (level > 50) return 'Nivel Adecuado';
    if (level > 25) return 'Nivel Bajo';
    return 'Nivel Crítico';
  };

  const maxHeight = 140;
  const fillHeight = (animatedPercentage / 100) * maxHeight;
  const yPosition = 150 - fillHeight;
  const waterColors = getGradient(percentage);
  const statusText = getStatusText(percentage);

  const generateWavePath = (baseY: number, amplitude: number, frequency: number, phase: number) => {
    let path = `M 10 ${baseY} `;
    for (let x = 0; x <= 80; x += 4) {
      const y = baseY + amplitude * Math.sin((x / 80) * frequency * Math.PI + phase);
      path += `L ${10 + x} ${y} `;
    }
    path += `L 90 ${baseY + maxHeight} L 10 ${baseY + maxHeight} Z`;
    return path;
  };

  const wave1 = generateWavePath(yPosition, 3, 4, waveTick / 10);
  const wave2 = generateWavePath(yPosition, 2, 3, (waveTick / 10) + 1);

  return (
    <div className="relative mb-6">
      <svg viewBox="0 0 100 160" className="w-44 h-48 mx-auto">
        <defs>
          <linearGradient id={waterGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={waterColors[0]} />
            <stop offset="100%" stopColor={waterColors[1]} />
          </linearGradient>
          <linearGradient id={tankGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect x="10" y="10" width="80" height="140" rx="3" ry="3" fill="none" stroke={`url(#${tankGradientId})`} strokeWidth="3" />
        
        <path d="M 13 13 L 87 13 L 87 147 L 13 147 Z" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
        
        <path d={wave1} fill={`url(#${waterGradientId})`} opacity="0.7">
          <animate attributeName="d" dur="3s" repeatCount="indefinite" 
                   values={`${wave1};${generateWavePath(yPosition, 3, 4, (waveTick / 10) + Math.PI)};${wave1}`} />
        </path>
        <path d={wave2} fill={`url(#${waterGradientId})`} opacity="0.5">
          <animate attributeName="d" dur="2.5s" repeatCount="indefinite" 
                   values={`${wave2};${generateWavePath(yPosition, 2, 3, (waveTick / 10) + Math.PI + 1)};${wave2}`} />
        </path>
        
        <line x1="5" y1="46" x2="15" y2="46" stroke="currentColor" strokeWidth="1.5" />
        <text x="3" y="49" fill="currentColor" fontSize="8" textAnchor="end">75%</text>
        
        <line x1="5" y1="79" x2="15" y2="79" stroke="currentColor" strokeWidth="1.5" />
        <text x="3" y="82" fill="currentColor" fontSize="8" textAnchor="end">50%</text>
        
        <line x1="5" y1="114" x2="15" y2="114" stroke="currentColor" strokeWidth="1.5" />
        <text x="3" y="117" fill="currentColor" fontSize="8" textAnchor="end">25%</text>
        
        <text x="50" y="80" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" filter={`url(#${glowId})`}>
          {`${Math.round(animatedPercentage)}%`}
        </text>
        
        <path d="M50,30 C50,30 40,15 40,10 C40,4.5 45,0 50,0 C55,0 60,4.5 60,10 C60,15 50,30 50,30 Z" 
              transform="translate(65, 3) scale(0.5)  rotate(180 50 15)" 
              fill={getFillColor(percentage)} 
              opacity="0.9" 
              filter={`url(#${glowId})`}>
          <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
      
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          percentage > 50 ? 'bg-green-100 text-green-800' : 
          percentage > 25 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          <span className={`mr-1.5 h-2 w-2 inline-block rounded-full ${
            percentage > 50 ? 'bg-green-500' : 
            percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
          }`} style={{ animation: 'pulse 1.5s infinite' }}></span>
          {statusText}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.5; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
import React, { useState, useEffect } from 'react';

interface IndicatorProps {
  status: number;
}

export const PumpIndicator = ({ status }: IndicatorProps) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const [animatedStatus, setAnimatedStatus] = useState(status);

  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const statusGradients = [
    ['#3b82f6', '#2563eb'], 
    ['#22c55e', '#16a34a'], 
    ['#ef4444', '#dc2626'], 
    ['#f97316', '#ea580c']  
  ];
  const labels = ['Reposo', 'Operación', 'Falla', 'Selector Fuera'];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStatus(status);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [status]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (animatedStatus === 1) { 
      timer = setInterval(() => {
        setRotationAngle(prev => (prev + 5) % 360);
      }, 50);
    } else {
      setRotationAngle(0);
    }
    
    return () => clearInterval(timer);
  }, [animatedStatus]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (animatedStatus === 2) {
      timer = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.1 : 1);
      }, 500);
    } else {
      setPulseScale(1);
    }
    
    return () => clearInterval(timer);
  }, [animatedStatus]);

  const generateFanBlades = () => {
    const blades = [];
    const bladeCount = 6;
    
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * 360;
      blades.push(
        <path 
          key={i} 
          d="M50 45 Q60 40 50 35 Q40 40 50 45" 
          transform={`rotate(${angle}, 50, 50)`} 
          fill={animatedStatus === 1 ? "#ffffff" : "#e5e7eb"}
          opacity={0.9}
        />
      );
    }
    
    return blades;
  };

  const generateBubbles = () => {
    if (animatedStatus !== 1) return null;
    
    const bubbles = [];
    const bubbleCount = 3;
    
    for (let i = 0; i < bubbleCount; i++) {
      const delay = i * 1.5;
      bubbles.push(
        <circle 
          key={i} 
          cx="73" 
          cy={65 - (i * 15)} 
          r="3" 
          fill="white" 
          opacity="0.7">
          <animate 
            attributeName="cy" 
            from={65 - (i * 15)} 
            to="20" 
            dur="3s" 
            begin={`${delay}s`} 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            from="0.7" 
            to="0" 
            dur="3s" 
            begin={`${delay}s`} 
            repeatCount="indefinite" 
          />
        </circle>
      );
    }
    
    return bubbles;
  };

  const renderPipes = () => {
    return (
      <>
        <line x1="50" y1="70" x2="50" y2="90" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        
        <path d="M 70 50 L 85 50 L 85 20" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        
        {animatedStatus === 1 && (
          <>
            <circle cx="50" cy="75" r="2" fill="white">
              <animate attributeName="cy" from="75" to="85" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="80" r="2" fill="white" opacity="0.7">
              <animate attributeName="cy" from="80" to="90" dur="1s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1s" begin="0.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="45" r="2" fill="white">
              <animate attributeName="cy" from="45" to="25" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="40" r="2" fill="white" opacity="0.7">
              <animate attributeName="cy" from="40" to="20" dur="1s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1s" begin="0.3s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </>
    );
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-40 h-56 mx-auto">
        <defs>
          <linearGradient id={`pumpGradient-${animatedStatus}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={statusGradients[animatedStatus][0]} />
            <stop offset="100%" stopColor={statusGradients[animatedStatus][1]} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
        </defs>
        
        <rect x="25" y="65" width="50" height="5" rx="2" fill="#334155" filter="url(#shadow)" />
        
        {renderPipes()}
        
        <rect 
          x="30" 
          y="22" 
          width="18" 
          height="20" 
          rx="2"
          fill={statusColors[animatedStatus]} 
          stroke="#1e293b" 
          strokeWidth="1"
          style={{
            transform: animatedStatus === 2 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '39px 32px',
            transition: 'transform 0.3s ease'
          }}
        />
        
        <circle 
          cx="39" 
          cy="32" 
          r="6" 
          fill={statusColors[animatedStatus]} 
          filter="url(#glow)" 
          opacity={animatedStatus === 2 ? pulseScale : 0.9}
        >
          {animatedStatus === 2 && (
            <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
          )}
        </circle>
        
        <circle 
          cx="50" 
          cy="50" 
          r="20" 
          fill={`url(#pumpGradient-${animatedStatus})`} 
          stroke="#1e293b" 
          strokeWidth="2"
          filter="url(#shadow)"
          style={{
            transform: animatedStatus === 2 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '50px 50px',
            transition: 'transform 0.3s ease'
          }}
        />
        
        <circle 
          cx="50" 
          cy="50" 
          r="12" 
          fill="#f8fafc" 
          stroke="#94a3b8" 
          strokeWidth="1"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transformOrigin: '50px 50px',
            transition: 'transform 0.05s linear'
          }}
        />
        
        <g 
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transformOrigin: '50px 50px',
            transition: 'transform 0.05s linear'
          }}
        >
          {generateFanBlades()}
        </g>
        
        <circle cx="50" cy="50" r="4" fill={statusColors[animatedStatus]} stroke="#94a3b8" strokeWidth="0.5" />
        
        {generateBubbles()}
        
      </svg>
      
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          animatedStatus === 0 ? 'bg-blue-100 text-blue-800' : 
          animatedStatus === 1 ? 'bg-green-100 text-green-800' : 
          animatedStatus === 2 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {labels[animatedStatus]}
          <span className={`ml-1 h-2 w-2 inline-block rounded-full ${
            animatedStatus === 0 ? 'bg-blue-500' : 
            animatedStatus === 1 ? 'bg-green-500' : 
            animatedStatus === 2 ? 'bg-red-500' : 'bg-orange-500'
          }`} style={{ 
            animation: animatedStatus === 2 ? 'pulse 0.8s infinite' : 'pulse 2s infinite' 
          }}></span>
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
import React, { useState, useEffect, useId } from 'react';

interface ValveIndicatorProps {
  status: number;
  openPercent?: number;
}

export const ValveIndicator = ({ status, openPercent = status === 1 ? 100 : 0 }: ValveIndicatorProps) => {
  const uniqueId = useId();
  const [animatedStatus, setAnimatedStatus] = useState(status);
  const [animatedOpenPercent, setAnimatedOpenPercent] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(status === 1 ? 90 : 0);

  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const statusGradients = [
    ['#3b82f6', '#1d4ed8'], // Azul - En Reposo
    ['#22c55e', '#16a34a'], // Verde - Abierta
    ['#ef4444', '#b91c1c'], // Rojo - Fallo Detectado
    ['#f97316', '#c2410c']  // Naranja - Fuera de Servicio
  ];
  const labels = ['En Reposo', 'Abierta', 'Fallo Detectado', 'Fuera de Servicio'];

  // Status animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStatus(status);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [status]);

  // Rotation animation for valve handle
  useEffect(() => {
    const targetAngle = animatedStatus === 1 ? 90 : 0;
    const step = animatedStatus === 1 ? 5 : -5;
    
    if (rotationAngle !== targetAngle) {
      const timer = setTimeout(() => {
        setRotationAngle(prev => {
          const newAngle = prev + step;
          if ((step > 0 && newAngle >= targetAngle) || (step < 0 && newAngle <= targetAngle)) {
            return targetAngle;
          }
          return newAngle;
        });
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [animatedStatus, rotationAngle]);

  // Open percentage animation
  useEffect(() => {
    const targetPercent = animatedStatus === 1 ? openPercent : 0;
    const duration = 1000;
    const interval = 10;
    const steps = duration / interval;
    const increment = (targetPercent - animatedOpenPercent) / steps;
    
    if (Math.abs(targetPercent - animatedOpenPercent) > 1) {
      const timer = setTimeout(() => {
        setAnimatedOpenPercent(prev => {
          const newValue = prev + increment;
          if ((increment > 0 && newValue >= targetPercent) || (increment < 0 && newValue <= targetPercent)) {
            return targetPercent;
          }
          return newValue;
        });
      }, interval);
      
      return () => clearTimeout(timer);
    }
  }, [animatedStatus, animatedOpenPercent, openPercent]);

  // Error pulse animation
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

  // Calculate valve opening based on rotation angle
  const valveOpeningY = animatedStatus === 1 ? 54 - (animatedOpenPercent / 100) * 8 : 54;
  
  // Generate flow particles
  const generateFlowParticles = () => {
    if (animatedStatus !== 1) return null;
    
    const particles = [];
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const delay = i * 0.3;
      const position = i * 3;
      const size = 0.8;
      
      particles.push(
        <circle 
          key={`left-${i}`} 
          cx={25 - position} 
          cy="50" 
          r={size} 
          fill="#60a5fa" 
          opacity="0.8"
        >
          <animate 
            attributeName="cx" 
            from={25 - position} 
            to="50" 
            dur="1.5s" 
            begin={`${delay}s`} 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            from="0.8" 
            to="0" 
            dur="1.5s" 
            begin={`${delay}s`} 
            repeatCount="indefinite" 
          />
        </circle>
      );
      
      particles.push(
        <circle 
          key={`right-${i}`} 
          cx={75 + position} 
          cy="50" 
          r={size} 
          fill="#60a5fa" 
          opacity="0.8"
        >
          <animate 
            attributeName="cx" 
            from={75 + position} 
            to="50" 
            dur="1.5s" 
            begin={`${delay}s`} 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            from="0.8" 
            to="0" 
            dur="1.5s" 
            begin={`${delay}s`} 
            repeatCount="indefinite" 
          />
        </circle>
      );
    }
    
    return particles;
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-40 h-56 mx-auto">
        <defs>
          <linearGradient id={`valveGradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={statusGradients[animatedStatus][0]} />
            <stop offset="100%" stopColor={statusGradients[animatedStatus][1]} />
          </linearGradient>
          <filter id="valveGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="valveShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Input pipe */}
        <line x1="10" y1="50" x2="35" y2="50" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        
        {/* Output pipe */}
        <line x1="65" y1="50" x2="90" y2="50" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        
        {/* Main valve body */}
        <circle 
          cx="50" 
          cy="50" 
          r="15" 
          fill={`url(#valveGradient-${uniqueId})`} 
          stroke="#1e293b" 
          strokeWidth="2" 
          filter="url(#valveShadow)"
          style={{
            transform: animatedStatus === 2 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '50px 50px',
            transition: 'transform 0.3s ease'
          }}
        />
        
        {/* Valve stem */}
        <rect 
          x="48" 
          y="20" 
          width="4" 
          height="30" 
          fill="#64748b" 
          rx="1" 
        />
        
        {/* Valve handle */}
        <g 
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transformOrigin: '50px 25px',
            transition: 'transform 0.1s linear'
          }}
        >
          <rect 
            x="42" 
            y="23" 
            width="16" 
            height="4" 
            fill="#334155" 
            rx="1" 
            filter="url(#valveShadow)" 
          />
          <circle 
            cx="50" 
            cy="25" 
            r="3" 
            fill={statusColors[animatedStatus]} 
            stroke="#1e293b" 
            strokeWidth="0.5" 
          />
        </g>
        
        {/* Valve inner mechanism (gate) */}
        <rect 
          x="40" 
          y={valveOpeningY - 10} 
          width="20" 
          height="10" 
          fill="#e2e8f0" 
          stroke="#94a3b8" 
          strokeWidth="0.5" 
        />
        
        {/* Flow indicator */}
        {animatedStatus === 1 && (
          <rect 
            x="35" 
            y="48" 
            width="30" 
            height="4" 
            fill="#60a5fa" 
            opacity={animatedOpenPercent / 100} 
          >
            <animate 
              attributeName="opacity" 
              values={`${animatedOpenPercent / 100};${animatedOpenPercent / 150};${animatedOpenPercent / 100}`} 
              dur="1s" 
              repeatCount="indefinite" 
            />
          </rect>
        )}
        
        {/* Flow particles */}
        {generateFlowParticles()}
        
        {/* Pressure gauge */}
        <circle 
          cx="50" 
          cy="75" 
          r="8" 
          fill="white" 
          stroke="#1e293b" 
          strokeWidth="1" 
        />
        
        {/* Gauge markings */}
        <path d="M50 70 L50 68" stroke="#1e293b" strokeWidth="0.5" />
        <path d="M55 75 L57 75" stroke="#1e293b" strokeWidth="0.5" />
        <path d="M50 80 L50 82" stroke="#1e293b" strokeWidth="0.5" />
        <path d="M45 75 L43 75" stroke="#1e293b" strokeWidth="0.5" />
        
        {/* Gauge needle */}
        <path 
          d={`M50 75 L${50 + 5 * Math.cos(Math.PI * 0.75 + (animatedOpenPercent / 100) * Math.PI * 1.5)} ${75 + 5 * Math.sin(Math.PI * 0.75 + (animatedOpenPercent / 100) * Math.PI * 1.5)}`} 
          stroke={statusColors[animatedStatus]} 
          strokeWidth="0.7" 
          style={{
            transition: 'all 0.3s ease'
          }}
        />
        
        <circle 
          cx="50" 
          cy="75" 
          r="1.5" 
          fill={statusColors[animatedStatus]}
        />
        
        {/* Status indicator light */}
        <circle 
          cx="65" 
          cy="25" 
          r="5" 
          fill={statusColors[animatedStatus]} 
          filter="url(#valveGlow)" 
          style={{
            transform: animatedStatus === 2 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '65px 25px',
            transition: 'transform 0.3s ease'
          }}
        >
          {animatedStatus === 2 && (
            <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
      
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          animatedStatus === 0 ? 'bg-blue-100 text-blue-800' : 
          animatedStatus === 1 ? 'bg-green-100 text-green-800' : 
          animatedStatus === 2 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
        }`}>
          <span className={`mr-1.5 h-2 w-2 inline-block rounded-full ${
            animatedStatus === 0 ? 'bg-blue-500' : 
            animatedStatus === 1 ? 'bg-green-500' : 
            animatedStatus === 2 ? 'bg-red-500' : 'bg-orange-500'
          }`} style={{ 
            animation: animatedStatus === 2 ? 'pulse 0.8s infinite' : 'pulse 2s infinite' 
          }}></span>
          {labels[animatedStatus]}
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
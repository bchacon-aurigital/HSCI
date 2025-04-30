import React, { useState, useEffect, useId } from 'react';

interface ValveIndicatorProps {
  status: number;
  openPercent?: number;
}

export const ValveIndicator = ({ status = 0, openPercent }: ValveIndicatorProps) => {
  const uniqueId = useId();
  // Asegurarse de que el status esté en el rango válido (0-4)
  const safeStatus = (typeof status === 'number' && status >= 0 && status <= 4) ? Math.round(status) : 0;
  
  // Calculamos el porcentaje de apertura basado en el status (0-4)
  const calculatedOpenPercent = openPercent !== undefined ? openPercent : (safeStatus / 4) * 100;
  
  const [animatedStatus, setAnimatedStatus] = useState(safeStatus);
  const [animatedOpenPercent, setAnimatedOpenPercent] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(safeStatus > 0 ? (safeStatus / 4) * 90 : 0);

  // Colores para los diferentes estados - del 0 al 4
  const statusColors = ['#3b82f6', '#60a5fa', '#22c55e', '#16a34a', '#15803d'];
  const statusGradients = [
    ['#3b82f6', '#1d4ed8'], // Azul oscuro - Cerrada (0%)
    ['#60a5fa', '#3b82f6'], // Azul claro - Parcialmente abierta (25%)
    ['#22c55e', '#16a34a'], // Verde claro - Medio abierta (50%)
    ['#16a34a', '#15803d'], // Verde medio - Mayormente abierta (75%)
    ['#15803d', '#166534']  // Verde oscuro - Completamente abierta (100%)
  ];
  
  const labels = ['Cerrada', 'Apertura 25%', 'Apertura 50%', 'Apertura 75%', 'Completamente Abierta'];

  // Status animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStatus(safeStatus);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [safeStatus]);

  // Rotation animation for valve handle
  useEffect(() => {
    const targetAngle = (animatedStatus / 4) * 90;
    const step = targetAngle > rotationAngle ? 2 : -2;
    
    if (Math.abs(rotationAngle - targetAngle) > 1) {
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
    const targetPercent = calculatedOpenPercent;
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
  }, [animatedStatus, animatedOpenPercent, calculatedOpenPercent]);

  // Error pulse animation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    // Hacemos que pulse solo cuando hay un error (esto podría ser determinado de otra manera si es necesario)
    const shouldPulse = false;
    
    if (shouldPulse) {
      timer = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.1 : 1);
      }, 500);
    } else {
      setPulseScale(1);
    }
    
    return () => { if (timer) clearInterval(timer); };
  }, [animatedStatus]);

  // Calculate valve opening based on rotation angle
  const valveOpeningY = 54 - (animatedOpenPercent / 100) * 8;
  
  // Generate flow particles
  const generateFlowParticles = () => {
    if (animatedStatus === 0) return null;
    
    const particles = [];
    const particleCount = Math.ceil((animatedStatus / 4) * 8); // Más partículas cuanto más abierta
    
    for (let i = 0; i < particleCount; i++) {
      const delay = i * 0.3;
      const position = i * 3;
      // Tamaño de partícula basado en la apertura
      const size = 0.5 + (animatedOpenPercent / 100) * 0.5;
      
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

  // Asegurar que tenemos un índice de gradiente válido
  const safeGradientIdx = Math.min(4, Math.max(0, animatedStatus));
  const safeGradient = statusGradients[safeGradientIdx];
  const safeStartColor = safeGradient[0];
  const safeEndColor = safeGradient[1];

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-40 h-56 mx-auto">
        <defs>
          <linearGradient id={`valveGradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={safeStartColor} />
            <stop offset="100%" stopColor={safeEndColor} />
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
            transform: `scale(${pulseScale})`,
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
            transition: 'transform 0.2s linear'
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
            fill={statusColors[safeGradientIdx]} 
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
        
        {/* Flow indicator - intensity based on openness */}
        {animatedStatus > 0 && (
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
          stroke={statusColors[safeGradientIdx]} 
          strokeWidth="0.7" 
          style={{
            transition: 'all 0.3s ease'
          }}
        />
        
        <circle 
          cx="50" 
          cy="75" 
          r="1.5" 
          fill={statusColors[safeGradientIdx]}
        />
        
        {/* Status indicator light */}
        <circle 
          cx="65" 
          cy="25" 
          r="5" 
          fill={statusColors[safeGradientIdx]} 
          filter="url(#valveGlow)" 
          style={{
            transform: pulseScale !== 1 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '65px 25px',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Pulsación suave para todos los estados */}
          <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          safeGradientIdx === 0 ? 'bg-blue-100 text-blue-800' : 
          safeGradientIdx === 1 ? 'bg-blue-200 text-blue-800' : 
          safeGradientIdx === 2 ? 'bg-green-100 text-green-800' : 
          safeGradientIdx === 3 ? 'bg-green-200 text-green-800' : 
          'bg-green-300 text-green-800'
        }`}>
          <span className={`mr-1.5 h-2 w-2 inline-block rounded-full ${
            safeGradientIdx === 0 ? 'bg-blue-500' : 
            safeGradientIdx === 1 ? 'bg-blue-400' : 
            safeGradientIdx === 2 ? 'bg-green-500' : 
            safeGradientIdx === 3 ? 'bg-green-600' : 
            'bg-green-700'
          }`} style={{ 
            animation: 'pulse 2s infinite' 
          }}></span>
          {labels[safeGradientIdx]}
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
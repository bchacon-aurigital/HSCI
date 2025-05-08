import React, { useState, useEffect, useId, useRef } from 'react';

interface IndicatorProps {
  status: number;
  level?: number;
}


export const WellIndicator = ({ status, level = 50 }: IndicatorProps) => {
  const uniqueId = useId();
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [animatedStatus, setAnimatedStatus] = useState(status);
  const [waterRipple, setWaterRipple] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  
  // Refs para evitar recrear intervalos en cada renderizado
  const waterRippleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseScaleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const levelAnimationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const statusGradients = [
    ['#3b82f6', '#1d4ed8'],
    ['#22c55e', '#16a34a'],
    ['#ef4444', '#b91c1c'],
    ['#f97316', '#c2410c']
  ];
  const labels = ['En Reposo', 'Extracción Activa', 'Fallo Detectado', 'Fuera de Servicio'];

  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (levelAnimationInterval.current) {
      clearInterval(levelAnimationInterval.current);
    }
    
    const duration = 1500;
    const interval = 10;
    const steps = duration / interval;
    const increment = level / steps;
    let currentLevel = 0;

    levelAnimationInterval.current = setInterval(() => {
      currentLevel += increment;
      if (currentLevel >= level) {
        if (levelAnimationInterval.current) {
          clearInterval(levelAnimationInterval.current);
          levelAnimationInterval.current = null;
        }
        setAnimatedLevel(level);
      } else {
        setAnimatedLevel(currentLevel);
      }
    }, interval);

    return () => {
      if (levelAnimationInterval.current) {
        clearInterval(levelAnimationInterval.current);
        levelAnimationInterval.current = null;
      }
    };
  }, [level]);

  useEffect(() => {
    setAnimatedStatus(status);
  }, [status]);

  useEffect(() => {
    // Configurar el intervalo de ripple solo una vez en el montaje
    if (waterRippleInterval.current === null) {
      waterRippleInterval.current = setInterval(() => {
        setWaterRipple(prev => (prev + 1) % 100);
      }, 100);
    }
    
    return () => {
      if (waterRippleInterval.current) {
        clearInterval(waterRippleInterval.current);
        waterRippleInterval.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (pulseScaleInterval.current) {
      clearInterval(pulseScaleInterval.current);
      pulseScaleInterval.current = null;
    }

    if (animatedStatus === 2) {
      pulseScaleInterval.current = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.1 : 1);
      }, 500);
    } else {
      setPulseScale(1);
    }

    return () => {
      if (pulseScaleInterval.current) {
        clearInterval(pulseScaleInterval.current);
        pulseScaleInterval.current = null;
      }
    };
  }, [animatedStatus]);

  const wellHeight = 80;
  const maxWaterHeight = 35;
  const baseWaterY = 85;
  const waterY = baseWaterY - (animatedLevel / 100) * maxWaterHeight;

  const generateWaterSurface = (baseY: number, amplitude: number, frequency: number, phase: number) => {
    let path = `M 35 ${baseY} `;
    for (let x = 0; x <= 30; x += 2) {
      const y = baseY + amplitude * Math.sin((x / 30) * frequency * Math.PI + phase);
      path += `L ${35 + x} ${y} `;
    }
    path += `L 65 ${baseY} L 65 ${baseY + maxWaterHeight} L 35 ${baseY + maxWaterHeight} Z`;
    return path;
  };

  const waterSurface1 = generateWaterSurface(waterY, 1, 3, waterRipple / 10);
  const waterSurface2 = generateWaterSurface(waterY, 0.7, 2, (waterRipple / 10) + 1);

  const generateBubbles = () => {
    if (animatedStatus !== 1) return null;

    const bubbles = [];
    const bubbleCount = 5;

    for (let i = 0; i < bubbleCount; i++) {
      const xPos = 40 + (Math.random() * 20);
      const delay = i * 0.8;
      const size = 0.5 + (Math.random() * 1);

      bubbles.push(
        <circle
          key={i}
          cx={xPos}
          cy={baseWaterY - 5}
          r={size}
          fill="white"
          opacity="0.7">
          <animate
            attributeName="cy"
            from={baseWaterY - 5}
            to={waterY + 5}
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

  const generateSedimentLayers = () => {
    const layerCount = 5;
    const layerHeight = 2;
    const layerGap = 2;
    const layers = [];

    for (let i = 0; i < layerCount; i++) {
      const yPos = 40 + (i * (layerHeight + layerGap));

      layers.push(
        <rect
          key={i}
          x="35"
          y={yPos}
          width="30"
          height={layerHeight}
          fill="#374151"
          opacity={0.8 - (i * 0.1)}
        />
      );

      for (let j = 0; j < 5; j++) {
        const lineY = yPos + (j * 0.4);
        if (lineY < yPos + layerHeight) {
          layers.push(
            <line
              key={`line-${i}-${j}`}
              x1="35"
              y1={lineY}
              x2="65"
              y2={lineY}
              stroke="white"
              strokeWidth="0.2"
              opacity="0.6"
            />
          );
        }
      }
    }

    return layers;
  };

  const generateGridLines = () => {
    const verticalLines = [];
    const horizontalLines = [];
    const lineCount = 6;
    const spacing = 30 / (lineCount + 1);

    for (let i = 1; i <= lineCount; i++) {
      const xPos = 35 + (i * spacing);
      verticalLines.push(
        <line
          key={`v-${i}`}
          x1={xPos}
          y1="50"
          x2={xPos}
          y2="85"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.6"
        />
      );
    }

    for (let i = 1; i <= lineCount; i++) {
      const yPos = 50 + (i * spacing);
      horizontalLines.push(
        <line
          key={`h-${i}`}
          x1="35"
          y1={yPos}
          x2="65"
          y2={yPos}
          stroke="white"
          strokeWidth="0.8"
          opacity="0.6"
        />
      );
    }

    return [...verticalLines, ...horizontalLines];
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 100 120" className="w-40 h-56 mx-auto">
        <defs>
        <linearGradient id={`wellGradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={statusGradients[animatedStatus][0]} />
            <stop offset="100%" stopColor={statusGradients[animatedStatus][1]} />
          </linearGradient>
          <linearGradient id={`waterGradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.6" />
          </linearGradient>
          <filter id="wellGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="wellShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
          <clipPath id="wellClip">
            <rect x="35" y="50" width="30" height="35" />
          </clipPath>
        </defs>

        <rect
          x="35"
          y="10"
          width="30"
          height="80"
          fill="none"
          stroke="#1e293b"
          strokeWidth="2.5"
          rx="1"
          filter="url(#wellShadow)"
        />

        <rect
          x="32"
          y="10"
          width="36"
          height="5"
          fill="#334155"
          rx="1"
          filter="url(#wellShadow)"
        />

        {generateSedimentLayers()}

        <rect
          x="35"
          y="50"
          width="30"
          height="35"
          fill={`url(#wellGradient-${uniqueId})`}
          stroke="#1e293b"
          strokeWidth="1"
          style={{
            transform: animatedStatus === 2 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '50px 67.5px',
            transition: 'transform 0.3s ease'
          }}
        />

        {generateGridLines()}

        <g clipPath="url(#wellClip)">
          <path
            d={waterSurface1}
            fill={`url(#waterGradient-${uniqueId})`}
            opacity="0.8">
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values={`${waterSurface1};${generateWaterSurface(waterY, 1, 3, (waterRipple / 10) + Math.PI)};${waterSurface1}`}
            />
          </path>
          <path
            d={waterSurface2}
            fill="url(#374151)"
            opacity="0.6">
            <animate
              attributeName="d"
              dur="2.5s"
              repeatCount="indefinite"
              values={`${waterSurface2};${generateWaterSurface(waterY, 0.7, 2, (waterRipple / 10) + Math.PI + 1)};${waterSurface2}`}
            />
          </path>

          {generateBubbles()}
        </g>


        <circle
          cx="50"
          cy="30"
          r="7"
          fill={statusColors[animatedStatus]}
          stroke="#1e293b"
          strokeWidth="1"
          filter="url(#wellGlow)"
          style={{
            transform: animatedStatus === 2 ? `scale(${pulseScale})` : 'scale(1)',
            transformOrigin: '50px 30px',
            transition: 'transform 0.3s ease'
          }}
        >
          {animatedStatus === 2 && (
            <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
          )}
        </circle>

      </svg>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
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
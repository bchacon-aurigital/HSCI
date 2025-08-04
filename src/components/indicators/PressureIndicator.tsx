import React, { useState, useEffect, useId, useRef } from 'react';

interface PressureIndicatorProps {
  pressure: number; // Presión en PSI
  maxPressure?: number; // Presión máxima del gauge (default: 100 PSI)
  unit?: 'PSI' | 'kg/cm²' | 'Bar'; // Unidad de medida
  id?: string;
}

export const PressureIndicator = ({ 
  pressure, 
  maxPressure = 100, 
  unit = 'PSI',
  id 
}: PressureIndicatorProps) => {
  const [animatedPressure, setAnimatedPressure] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  
  const uniqueId = useId();
  const gaugeId = id || uniqueId;
  
  // Refs para controlar los intervalos
  const pressureAnimationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnimationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const gradientId = `pressureGradient-${gaugeId}`;
  const needleGradientId = `needleGradient-${gaugeId}`;
  const glowId = `pressureGlow-${gaugeId}`;
  
  // Determinar colores según el nivel de presión
  const getPressureColor = (currentPressure: number) => {
    const percentage = (currentPressure / maxPressure) * 100;
    if (percentage < 30) return '#22c55e'; // Verde - presión baja/normal
    if (percentage < 70) return '#3b82f6'; // Azul - presión normal
    if (percentage < 85) return '#f59e0b'; // Amarillo - presión alta
    return '#ef4444'; // Rojo - presión crítica
  };
  
  // Calcular ángulo de la aguja (de -135° a +135°, total 270°)
  const getNeedleAngle = (currentPressure: number) => {
    const clampedPressure = Math.max(0, Math.min(currentPressure, maxPressure));
    const percentage = clampedPressure / maxPressure;
    return -135 + (percentage * 270); // De -135° a +135°
  };
  
  // Animación de presión
  useEffect(() => {
    if (pressureAnimationInterval.current) {
      clearInterval(pressureAnimationInterval.current);
      pressureAnimationInterval.current = null;
    }
    
    const duration = 1500;
    const interval = 10;
    const steps = duration / interval;
    const increment = pressure / steps;
    let currentPressure = 0;
    
    pressureAnimationInterval.current = setInterval(() => {
      currentPressure += increment;
      if (currentPressure >= pressure) {
        if (pressureAnimationInterval.current) {
          clearInterval(pressureAnimationInterval.current);
          pressureAnimationInterval.current = null;
        }
        setAnimatedPressure(pressure);
      } else {
        setAnimatedPressure(currentPressure);
      }
    }, interval);
    
    return () => {
      if (pressureAnimationInterval.current) {
        clearInterval(pressureAnimationInterval.current);
        pressureAnimationInterval.current = null;
      }
    };
  }, [pressure]);
  
  // Animación de pulso para presiones altas
  useEffect(() => {
    if (pulseAnimationInterval.current) {
      clearInterval(pulseAnimationInterval.current);
      pulseAnimationInterval.current = null;
    }
    
    const percentage = (animatedPressure / maxPressure) * 100;
    
    if (percentage > 85) {
      // Pulso para presión crítica
      pulseAnimationInterval.current = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.05 : 1);
      }, 800);
    } else {
      setPulseScale(1);
    }
    
    return () => {
      if (pulseAnimationInterval.current) {
        clearInterval(pulseAnimationInterval.current);
        pulseAnimationInterval.current = null;
      }
    };
  }, [animatedPressure, maxPressure]);
  
  const currentColor = getPressureColor(animatedPressure);
  const needleAngle = getNeedleAngle(animatedPressure);
  
  // Crear marcas del gauge (cada 10% del máximo)
  const createGaugeMarks = () => {
    const marks = [];
    for (let i = 0; i <= 10; i++) {
      const angle = -135 + (i * 27); // 270° / 10 = 27° por marca
      const value = (maxPressure / 10) * i;
      
      // Línea de marca
      const x1 = 50 + 35 * Math.cos((angle * Math.PI) / 180);
      const y1 = 50 + 35 * Math.sin((angle * Math.PI) / 180);
      const x2 = 50 + 40 * Math.cos((angle * Math.PI) / 180);
      const y2 = 50 + 40 * Math.sin((angle * Math.PI) / 180);
      
      // Texto del valor
      const textX = 50 + 45 * Math.cos((angle * Math.PI) / 180);
      const textY = 50 + 45 * Math.sin((angle * Math.PI) / 180);
      
      marks.push(
        <g key={i}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6b7280"
            strokeWidth={i % 2 === 0 ? "2" : "1"}
          />
          {i % 2 === 0 && (
            <text
              x={textX}
              y={textY}
              fill="#9ca3af"
              fontSize="3"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {Math.round(value)}
            </text>
          )}
        </g>
      );
    }
    return marks;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative"
        style={{ transform: `scale(${pulseScale})`, transition: 'transform 0.3s ease' }}
      >
        <svg
          width="160"
          height="120"
          viewBox="0 0 100 75"
          className="drop-shadow-lg"
        >
          <defs>
            {/* Gradiente para el fondo del gauge */}
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </radialGradient>
            
            {/* Gradiente para la aguja */}
            <linearGradient id={needleGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentColor} />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            
            {/* Efecto de brillo */}
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Fondo del gauge */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill={`url(#${gradientId})`}
            stroke="#4b5563"
            strokeWidth="2"
          />
          
          {/* Arco de fondo del gauge */}
          <path
            d="M 15 50 A 35 35 0 1 1 85 50"
            fill="none"
            stroke="#6b7280"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Arco de color según la presión */}
          <path
            d="M 15 50 A 35 35 0 1 1 85 50"
            fill="none"
            stroke={currentColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="219.9" // Circunferencia del arco
            strokeDashoffset={219.9 - (219.9 * (animatedPressure / maxPressure))}
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
            filter={`url(#${glowId})`}
          />
          
          {/* Marcas del gauge */}
          {createGaugeMarks()}
          
          {/* Centro del gauge */}
          <circle
            cx="50"
            cy="50"
            r="3"
            fill="#374151"
            stroke="#6b7280"
            strokeWidth="1"
          />
          
          {/* Aguja */}
          <g transform={`rotate(${needleAngle} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="20"
              stroke={`url(#${needleGradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
              filter={`url(#${glowId})`}
            />
            <circle
              cx="50"
              cy="50"
              r="2"
              fill={currentColor}
            />
          </g>
          
          {/* Texto del valor */}
          <text
            x="50"
            y="65"
            fill={currentColor}
            fontSize="6"
            fontWeight="bold"
            textAnchor="middle"
            filter={`url(#${glowId})`}
          >
            {animatedPressure.toFixed(1)}
          </text>
          
          {/* Unidad */}
          <text
            x="50"
            y="70"
            fill="#9ca3af"
            fontSize="3"
            textAnchor="middle"
          >
            {unit}
          </text>
        </svg>
      </div>
      
      {/* Indicador de estado */}
      <div className="mt-2 text-center">
        <div 
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${currentColor}20`, 
            color: currentColor,
            border: `1px solid ${currentColor}40`
          }}
        >
          {((animatedPressure / maxPressure) * 100) < 30 && 'Presión Baja'}
          {((animatedPressure / maxPressure) * 100) >= 30 && ((animatedPressure / maxPressure) * 100) < 70 && 'Presión Normal'}
          {((animatedPressure / maxPressure) * 100) >= 70 && ((animatedPressure / maxPressure) * 100) < 85 && 'Presión Alta'}
          {((animatedPressure / maxPressure) * 100) >= 85 && 'Presión Crítica'}
        </div>
      </div>
    </div>
  );
}; 
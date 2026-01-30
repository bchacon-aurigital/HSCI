'use client';
import React, { useEffect, useState, useRef, useId } from 'react';

interface FlowRanges {
  veryLow: number;
  low: number;
  normalMax: number;
  high: number;
}

interface FlowIndicatorProps {
  flow: number;
  unit?: string;
  flowRanges?: FlowRanges;
}

export const FlowIndicator = ({
  flow,
  unit = 'L/s',
  flowRanges = { veryLow: 5, low: 10, normalMax: 100, high: 120 }
}: FlowIndicatorProps) => {
  const [offset, setOffset] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uniqueId = useId();

  const getFlowColor = () => {
    if (flow <= 0) return { main: '#3b82f6', gradient: ['#3b82f6', '#2563eb'] };
    if (flow < flowRanges.veryLow) return { main: '#ef4444', gradient: ['#ef4444', '#dc2626'] };
    if (flow < flowRanges.low) return { main: '#f59e0b', gradient: ['#f59e0b', '#d97706'] };
    if (flow <= flowRanges.normalMax) return { main: '#22c55e', gradient: ['#22c55e', '#16a34a'] };
    if (flow <= flowRanges.high) return { main: '#f59e0b', gradient: ['#f59e0b', '#d97706'] };
    return { main: '#ef4444', gradient: ['#ef4444', '#dc2626'] };
  };

  const getFlowStatus = () => {
    if (flow <= 0) return 'Sin Flujo';
    if (flow < flowRanges.veryLow) return 'Caudal Muy Bajo';
    if (flow < flowRanges.low) return 'Caudal Bajo';
    if (flow <= flowRanges.normalMax) return 'Caudal Normal';
    if (flow <= flowRanges.high) return 'Caudal Alto';
    return 'Caudal Muy Alto';
  };

  const { main: color, gradient } = getFlowColor();
  const status = getFlowStatus();

  const speed = flow <= 0 ? 0 : Math.max(8, 40 - (flow / flowRanges.normalMax) * 32);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (flow > 0) {
      intervalRef.current = setInterval(() => {
        setOffset(prev => (prev + 2) % 70);
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [flow, speed]);

  const arrowGradientId = `arrowGradient-${uniqueId}`;
  const glowId = `arrowGlow-${uniqueId}`;

  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox="0 0 200 70" className="w-full max-w-[260px]">
        <defs>
          {/* Gradiente de las flechas */}
          <linearGradient id={arrowGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>

          {/* Glow effect */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip para las flechas */}
          <clipPath id={`pipeClip-${uniqueId}`}>
            <rect x="26" y="18" width="148" height="34" rx="2" />
          </clipPath>
        </defs>

        {/* Brida izquierda */}
        <rect x="2" y="10" width="12" height="50" rx="2" fill="#4a5568" />
        <rect x="14" y="15" width="8" height="40" fill="#374151" />
        <circle cx="8" cy="18" r="3" fill="#1f2937" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="8" cy="35" r="3" fill="#1f2937" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="8" cy="52" r="3" fill="#1f2937" stroke="#4a5568" strokeWidth="0.5" />

        {/* Tubería principal */}
        <rect x="22" y="12" width="156" height="46" rx="4" fill="#313f53" />

        {/* Interior de la tubería */}
        <rect x="26" y="18" width="148" height="34" rx="2" fill="#111827" />

        {/* Flechas animadas */}
        <g clipPath={`url(#pipeClip-${uniqueId})`}>
          {flow > 0 ? (
            <>
              {[0, 1, 2, 3].map((i) => {
                const xPos = ((i * 70) + offset - 70) % 280 - 35;
                return (
                  <g key={i} transform={`translate(${xPos}, 0)`} filter={`url(#${glowId})`}>
                    {/* Flecha apuntando a la derecha → */}
                    <path
                      d="M30 29 L45 29 L45 24 L60 35 L45 46 L45 41 L30 41 Z"
                      fill={`url(#${arrowGradientId})`}
                    />
                  </g>
                );
              })}
            </>
          ) : (
            <text x="100" y="40" textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="600">
              SIN FLUJO
            </text>
          )}
        </g>

        {/* Brida derecha */}
        <rect x="178" y="15" width="8" height="40" fill="#374151" />
        <rect x="186" y="10" width="12" height="50" rx="2" fill="#4a5568" />
        <circle cx="192" cy="18" r="3" fill="#1f2937" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="192" cy="35" r="3" fill="#1f2937" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="192" cy="52" r="3" fill="#1f2937" stroke="#4a5568" strokeWidth="0.5" />
      </svg>

      {/* Valor */}
      <div className="mt-3 flex items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{ color }}
        >
          {flow.toFixed(1)}
        </span>
        <span className="ml-2 text-lg text-gray-400">{unit}</span>
      </div>

      {/* Estado */}
      <div
        className="mt-1 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${color}20`,
          color: color,
          border: `1px solid ${color}40`
        }}
      >
        {status}
      </div>
    </div>
  );
};

export default FlowIndicator;

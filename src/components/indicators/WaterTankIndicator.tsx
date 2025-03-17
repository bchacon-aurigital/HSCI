import React from 'react';

interface WaterTankIndicatorProps {
  percentage: number;
}

export const WaterTankIndicator = ({ percentage }: WaterTankIndicatorProps) => {
  const getFillColor = (level: number) => {
    if (level > 50) return '#22c55e'; 
    if (level > 25) return '#eab308'; 
    return '#ef4444'; 
  };

  const maxHeight = 140;
  const fillHeight = (percentage / 100) * maxHeight;
  const yPosition = 150 - fillHeight;

  return (
    <svg viewBox="0 0 100 160" className="w-44 h-48 mx-auto">
      <path d="M10,10 h80 v140 h-80 z" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y={yPosition} width="80" height={fillHeight} fill={getFillColor(percentage)} opacity="0.8" />
      <text x="50" y="80" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{`${percentage}%`}</text>
      
      <line x1="5" y1="46" x2="15" y2="46" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="44" fill="currentColor" fontSize="10" textAnchor="end">75%</text>
      
      <line x1="5" y1="79" x2="15" y2="79" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="84" fill="currentColor" fontSize="10" textAnchor="end">50%</text>
      
      <line x1="5" y1="114" x2="15" y2="114" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="124" fill="currentColor" fontSize="10" textAnchor="end">25%</text>
    </svg>
  );
};
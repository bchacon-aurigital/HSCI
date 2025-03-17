import React from 'react';

interface IndicatorProps {
  status: number;
}

export const WellIndicator = ({ status }: IndicatorProps) => {
  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const labels = ['Reposo', 'Operación', 'Falla', 'Selector Fuera'];
  
  return (
    <svg viewBox="0 0 100 120" className="w-32 h-48 mx-auto">
      <rect x="35" y="10" width="30" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
      
      <rect x="35" y="40" width="30" height="10" fill="#374151" />
      
      <line x1="35" y1="40" x2="65" y2="40" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="42" x2="65" y2="42" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="44" x2="65" y2="44" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="46" x2="65" y2="46" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="48" x2="65" y2="48" stroke="white" strokeWidth="0.8" />
      
      <line x1="39" y1="40" x2="39" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="43" y1="40" x2="43" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="47" y1="40" x2="47" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="51" y1="40" x2="51" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="55" y1="40" x2="55" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="59" y1="40" x2="59" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="63" y1="40" x2="63" y2="50" stroke="white" strokeWidth="0.8" />
      
      <rect x="35" y="50" width="30" height="35" fill={statusColors[status]} stroke="currentColor" strokeWidth="1" />
      
      <line x1="40" y1="55" x2="40" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="45" y1="55" x2="45" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="50" y1="55" x2="50" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="55" y1="55" x2="55" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="60" y1="55" x2="60" y2="80" stroke="white" strokeWidth="1.5" />
      
      <text x="50" y="105" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">{labels[status]}</text>
    </svg>
  );
};
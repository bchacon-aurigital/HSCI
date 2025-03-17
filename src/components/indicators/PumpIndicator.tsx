import React from 'react';

interface IndicatorProps {
  status: number;
}

export const PumpIndicator = ({ status }: IndicatorProps) => {
  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const labels = ['Reposo', 'Operación', 'Falla', 'Selector Fuera'];
  
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-48 mx-auto">
      <rect x="31" y="24" width="15" height="18" fill={statusColors[status]} stroke="currentColor" strokeWidth="2" />
      
      <circle cx="50" cy="50" r="20" fill={statusColors[status]} stroke="currentColor" strokeWidth="2" />
          
      <circle cx="50" cy="50" r="10" fill="white" stroke="currentColor" strokeWidth="1" />
      
      <path d="M50 40 Q55 45 50 50 Q45 45 50 40" fill="white" />
      <path d="M50 50 Q55 55 50 60 Q45 55 50 50" fill="white" />
      <path d="M40 50 Q45 55 50 50 Q45 45 40 50" fill="white" />
      <path d="M50 50 Q55 45 60 50 Q55 55 50 50" fill="white" />
      
      <rect x="30" y="68" width="40" height="10" fill="currentColor" />
      
      <text x="50" y="95" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">{labels[status]}</text>
    </svg>
  );
};

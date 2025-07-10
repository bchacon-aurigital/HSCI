'use client';

import React, { useState } from 'react';
import { RotateCcw, Loader2, Eye, Zap } from 'lucide-react';
import { queryResetStatus, toggleResetValue } from '@/utils/firebaseWrite';

interface ResetButtonProps {
  onResetComplete?: (success: boolean, error?: string) => void;
  className?: string;
}

type ResetState = 'idle' | 'querying' | 'showing' | 'executing';

const ResetButton: React.FC<ResetButtonProps> = ({ 
  onResetComplete, 
  className = '' 
}) => {
  const [state, setState] = useState<ResetState>('idle');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);

  const handleQueryReset = async () => {
    setState('querying');
    
    try {
      const result = await queryResetStatus();
      
      if (result.success && result.currentValue !== undefined) {
        setCurrentValue(result.currentValue);
        setState('showing');
        setLastActionTime(new Date());
        onResetComplete?.(true);
      } else {
        onResetComplete?.(false, result.error);
        setState('idle');
      }
    } catch (error) {
      onResetComplete?.(false, 'Error al consultar reset');
      setState('idle');
    }
  };

  const handleToggleReset = async () => {
    if (currentValue === null) return;
    
    setState('executing');
    
    try {
      const result = await toggleResetValue(currentValue);
      
      if (result.success) {
        setLastActionTime(new Date());
        onResetComplete?.(true);
        // After successful toggle, allow querying again
        setTimeout(() => {
          setState('idle');
          setCurrentValue(null);
        }, 2000);
      } else {
        onResetComplete?.(false, result.error);
        setState('showing');
      }
    } catch (error) {
      onResetComplete?.(false, 'Error al cambiar estado');
      setState('showing');
    }
  };

  const handleBackToQuery = () => {
    setState('idle');
    setCurrentValue(null);
  };

  const getButtonConfig = () => {
    switch (state) {
      case 'querying':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Consultando...',
          disabled: true,
          className: 'bg-gray-400 cursor-not-allowed'
        };
      case 'showing':
        const nextValue = currentValue === 0 ? 1 : 0;
        return {
          icon: <Zap className="h-4 w-4" />,
          text: `Cambiar a ${nextValue}`,
          disabled: false,
          className: currentValue === 0 
            ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
        };
      case 'executing':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Ejecutando...',
          disabled: true,
          className: 'bg-gray-400 cursor-not-allowed'
        };
      default:
        return {
          icon: <Eye className="h-4 w-4" />,
          text: 'Consultar Reset',
          disabled: false,
          className: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        };
    }
  };

  const buttonConfig = getButtonConfig();

  const handleButtonClick = () => {
    if (state === 'idle') {
      handleQueryReset();
    } else if (state === 'showing') {
      handleToggleReset();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleButtonClick}
        disabled={buttonConfig.disabled}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
          ${buttonConfig.className}
          text-white shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:shadow-none
        `}
      >
        {buttonConfig.icon}
        {buttonConfig.text}
      </button>
      
      {state === 'showing' && currentValue !== null && (
        <div className="text-xs text-center">
          <p className={`font-medium ${currentValue === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
            Estado: {currentValue === 1 ? 'Activo (1)' : 'Inactivo (0)'}
          </p>
          <button
            onClick={handleBackToQuery}
            className="text-gray-400 hover:text-gray-300 underline mt-1"
          >
            Consultar nuevamente
          </button>
        </div>
      )}
      
      {lastActionTime && (
        <p className="text-xs text-gray-500">
          Última acción: {lastActionTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default ResetButton;
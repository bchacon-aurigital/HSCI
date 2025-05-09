import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';
import { useRef, useEffect, useState } from 'react';

// Declaración para TypeScript
declare global {
  interface Window {
    isRealTimeActive?: boolean;
  }
}

export const useDeviceData = (identifier: string, pumpKey?: string, codigoAsada?: string) => {
  const dataRef = useRef<any>(null);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [optimizedLoading, setOptimizedLoading] = useState(true);
  const [optimizedError, setOptimizedError] = useState<string | null>(null);

  if (identifier.startsWith('http')) {
    const result = useIndividualDeviceData(identifier, pumpKey);
    
    // Usar useEffect para actualizar solo si cambian los datos
    useEffect(() => {
      const newDataString = JSON.stringify(result.data);
      const prevDataString = JSON.stringify(dataRef.current);
      
      if (newDataString !== prevDataString || result.loading !== optimizedLoading || result.error !== optimizedError) {
        dataRef.current = result.data;
        setOptimizedData(result.data);
        setOptimizedLoading(result.loading);
        setOptimizedError(result.error);
      }
    }, [result.data, result.loading, result.error]);
    
    return { 
      data: optimizedData, 
      loading: optimizedLoading, 
      error: optimizedError 
    };
  } else if (codigoAsada) {
    const { data, loading, error } = useAggregatedData(codigoAsada);
    
    // Usar useEffect para actualizar solo si cambian los datos relevantes
    useEffect(() => {
      if (loading) {
        setOptimizedLoading(true);
        return;
      }
      
      if (error) {
        setOptimizedError(error);
        setOptimizedLoading(false);
        return;
      }
      
      // Verificar si los datos existen
      if (data[identifier] === undefined || data[identifier] === null) {
        console.warn("No data found for key:", identifier);
        setOptimizedData(null);
        setOptimizedLoading(false);
        return;
      }
      
      // Extraer datos específicos según el tipo de dispositivo
      const deviceData = pumpKey ? data[identifier]?.[pumpKey] : data[identifier];
      
      // En modo tiempo real, siempre actualizar para mantener la sincronización
      // Esto evita problemas donde los datos parecen no cambiar
      if (window.isRealTimeActive) {
        dataRef.current = deviceData;
        setOptimizedData(deviceData);
        setOptimizedLoading(false);
        setOptimizedError(null);
        return;
      }
      
      // En modo normal, solo actualizar si cambian los datos
      const newDataString = JSON.stringify(deviceData);
      const prevDataString = JSON.stringify(dataRef.current);
      
      if (newDataString !== prevDataString || loading !== optimizedLoading || error !== optimizedError) {
        dataRef.current = deviceData;
        setOptimizedData(deviceData);
        setOptimizedLoading(loading);
        setOptimizedError(error);
      }
    }, [data, loading, error, identifier, pumpKey]);
    
    return { 
      data: optimizedData, 
      loading: optimizedLoading, 
      error: optimizedError 
    };
  } else {
    return { 
      data: null, 
      loading: false, 
      error: 'Código de ASADA requerido para este tipo de dispositivo' 
    };
  }
};

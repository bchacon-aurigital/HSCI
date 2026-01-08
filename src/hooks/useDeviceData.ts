import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';
import { useRef, useEffect, useState } from 'react';

declare global {
  interface Window {
    isRealTimeActive?: boolean;
  }
}

export const useDeviceData = (
  identifier: string,
  pumpKey?: string,
  codigoAsada?: string
) => {
  const isIndividual = identifier.startsWith('http');

  const individual = useIndividualDeviceData(identifier, pumpKey);
  const aggregated = useAggregatedData(codigoAsada ?? '');

  const dataRef = useRef<any>(null);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [optimizedLoading, setOptimizedLoading] = useState(true);
  const [optimizedError, setOptimizedError] = useState<string | null>(null);

  useEffect(() => {
    if (!isIndividual) return;

    const { data, loading, error } = individual;

    const newDataString = JSON.stringify(data);
    const prevDataString = JSON.stringify(dataRef.current);

    if (
      newDataString !== prevDataString ||
      loading !== optimizedLoading ||
      error !== optimizedError
    ) {
      dataRef.current = data;
      setOptimizedData(data);
      setOptimizedLoading(loading);
      setOptimizedError(error);
    }
  }, [
    isIndividual,
    individual.data,
    individual.loading,
    individual.error,
    optimizedLoading,
    optimizedError,
  ]);

  useEffect(() => {
    if (isIndividual || !codigoAsada) return;

    const { data, loading, error } = aggregated;

    if (loading) {
      setOptimizedLoading(true);
      return;
    }

    if (error) {
      setOptimizedError(error);
      setOptimizedLoading(false);
      return;
    }

    if (!data || data[identifier] === undefined || data[identifier] === null) {
      console.warn('No data found for key:', identifier);
      setOptimizedData(null);
      setOptimizedLoading(false);
      return;
    }

    // Para tanques y dispositivos que necesitan acceso a todos los campos,
    // devolver el objeto completo del identifier, no solo el pumpKey
    const deviceData = data[identifier];

    if (window.isRealTimeActive) {
      dataRef.current = deviceData;
      setOptimizedData(deviceData);
      setOptimizedLoading(false);
      setOptimizedError(null);
      return;
    }

    const newDataString = JSON.stringify(deviceData);
    const prevDataString = JSON.stringify(dataRef.current);

    if (newDataString !== prevDataString || error !== optimizedError) {
      dataRef.current = deviceData;
      setOptimizedData(deviceData);
      setOptimizedError(error);
    }

    // Siempre actualizar loading a false cuando hay datos válidos
    setOptimizedLoading(false);
  }, [
    isIndividual,
    codigoAsada,
    aggregated.data,
    aggregated.loading,
    aggregated.error,
    identifier,
    pumpKey,
    optimizedError,
  ]);

  if (!isIndividual && !codigoAsada) {
    return {
      data: null,
      loading: false,
      error: 'Codigo de ASADA requerido para este tipo de dispositivo',
    };
  }

  return {
    data: optimizedData,
    loading: optimizedLoading,
    error: optimizedError,
  };
};

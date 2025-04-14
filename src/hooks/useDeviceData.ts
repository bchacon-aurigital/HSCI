// src/hooks/useDeviceData.ts
import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';

export const useDeviceData = (identifier: string, pumpKey?: string, codigoAsada?: string) => {
  // Siempre llamamos a ambos hooks incondicionalmente, siguiendo las reglas de hooks
  const individualResult = useIndividualDeviceData(identifier, pumpKey);
  const aggregatedResult = useAggregatedData(codigoAsada || '');
  
  // Luego usamos lógica condicional con los resultados
  if (identifier.startsWith('http')) {
    // Usamos el resultado del hook individualResult que ya fue llamado
    return individualResult;
  } else if (codigoAsada) {
    const { data, loading, error } = aggregatedResult;

    if (!loading && (data[identifier] === undefined || data[identifier] === null)) {
      console.warn("No data found for key:", identifier);
      return { data: null, loading, error };
    }

    const deviceData = pumpKey ? data[identifier]?.[pumpKey] : data[identifier];
    return { data: deviceData, loading, error };
  } else {
    return { 
      data: null, 
      loading: false, 
      error: 'Código de ASADA requerido para este tipo de dispositivo' 
    };
  }
};
import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';

export const useDeviceData = (identifier: string, pumpKey?: string, codigoAsada?: string) => {
  if (identifier.startsWith('http')) {
    return useIndividualDeviceData(identifier, pumpKey);
  } else if (codigoAsada) {
    const { data, loading, error } = useAggregatedData(codigoAsada);

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

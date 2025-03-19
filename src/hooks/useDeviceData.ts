import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';

export const useDeviceData = (identifier: string, pumpKey?: string, codigoAsada?: string) => {
  // If the identifier is a URL, use the individual data hook
  if (identifier.startsWith('http')) {
    return useIndividualDeviceData(identifier, pumpKey);
  } else if (codigoAsada) {
    // For aggregated data, we need the ASADA code
    const { data, loading, error } = useAggregatedData(codigoAsada);

    // If loading has finished and the key doesn't exist, show a warning
    if (!loading && (data[identifier] === undefined || data[identifier] === null)) {
      console.warn("No data found for key:", identifier);
      return { data: null, loading, error };
    }

    // Use optional chaining to avoid errors if data[identifier] is undefined
    const deviceData = pumpKey ? data[identifier]?.[pumpKey] : data[identifier];
    return { data: deviceData, loading, error };
  } else {
    // If codigoAsada is not provided for a non-URL identifier, return an error
    return { 
      data: null, 
      loading: false, 
      error: 'Código de ASADA requerido para este tipo de dispositivo' 
    };
  }
};

import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';

export const useDeviceData = (identifier: string, pumpKey?: string, codigoAsada?: string) => {
  // Llamar siempre a ambos hooks, sin condiciones
  const individualDeviceData = useIndividualDeviceData(identifier, pumpKey);
  const aggregatedData = useAggregatedData(codigoAsada);

  // Lógica para manejar los resultados después de haber llamado los hooks
  if (identifier.startsWith('http')) {
    return individualDeviceData;
  } else if (codigoAsada) {
    const { data, loading, error } = aggregatedData;

    if (!loading && (data?.[identifier] === undefined || data?.[identifier] === null)) {
      console.warn("No data found for key:", identifier);
      return { data: null, loading, error };
    }

    const deviceData = pumpKey ? data?.[identifier]?.[pumpKey] : data?.[identifier];
    return { data: deviceData, loading, error };
  } else {
    return { 
      data: null, 
      loading: false, 
      error: 'Código de ASADA requerido para este tipo de dispositivo' 
    };
  }
};

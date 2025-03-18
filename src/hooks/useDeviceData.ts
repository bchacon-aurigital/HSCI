import { useAggregatedData } from './useAggregatedData';
import { useIndividualDeviceData } from './useIndividualDeviceData';

export const useDeviceData = (identifier: string, pumpKey?: string) => {
  // Si el identificador es una URL, usamos el hook individual.
  if (identifier.startsWith('http')) {
    return useIndividualDeviceData(identifier, pumpKey);
  } else {
    const { data, loading, error } = useAggregatedData();

    // Si ya terminó de cargar y la clave no existe, mostrar advertencia.
    if (!loading && (data[identifier] === undefined || data[identifier] === null)) {
      console.warn("No data found for key:", identifier);
      return { data: null, loading, error };
    }

    // Usamos el encadenamiento opcional para evitar error si data[identifier] es undefined.
    const deviceData = pumpKey ? data[identifier]?.[pumpKey] : data[identifier];
    return { data: deviceData, loading, error };
  }
};

import { useState, useEffect } from 'react';
import { DeviceData } from '../app/types/types';

// This will be updated dynamically based on the ASADA code
let groupedURLs: Record<string, string[]> = {};

// Function to set the URLs for a specific ASADA
export const setGroupedURLsForAsada = (asadaCode: string) => {
  switch (asadaCode) {
    case 'codigo1':
      groupedURLs = {
        'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/.json': [
          'MONTANA', 'VTBC1', 'VTBC2', 'VLST1', 'POZOVERDE', 'VLMT1', 'VLMT2', 'GEMELOS'
        ]
      };
      break;
    case 'codigo2':
      groupedURLs = {
        'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/OTRA_ASADA/.json': [
          'DISPOSITIVO1', 'DISPOSITIVO2', 'DISPOSITIVO3'
        ]
      };
      break;
    case 'codigo3':
      groupedURLs = {
        'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/TERCERA_ASADA/.json': [
          'TANQUE1', 'BOMBA1', 'POZO1'
        ]
      };
      break;
    default:
      groupedURLs = {};
  }
};

// Singleton pattern to cache data and prevent multiple calls
const dataCache: {
  data: Record<string, DeviceData>;
  lastFetched: number;
  loading: boolean;
  error: string | null;
  fetchPromise: Promise<void> | null;
  subscribers: number;
} = {
  data: {},
  lastFetched: 0,
  loading: false,
  error: null,
  fetchPromise: null,
  subscribers: 0
};

export function useAggregatedData(codigoAsada: string) {
  const [state, setState] = useState({
    data: dataCache.data,
    loading: true,
    error: dataCache.error
  });

  useEffect(() => {
    // Set the URLs for this ASADA
    setGroupedURLsForAsada(codigoAsada);
    
    // Increment subscribers count
    dataCache.subscribers++;

    const fetchData = async () => {
      // If data was fetched recently (within 2 minutes), use the cache
      const now = Date.now();
      if (now - dataCache.lastFetched < 2 * 60 * 1000 && Object.keys(dataCache.data).length > 0) {
        setState({
          data: dataCache.data,
          loading: false,
          error: dataCache.error
        });
        return;
      }

      // If a fetch is already in progress, wait for it to complete
      if (dataCache.fetchPromise) {
        await dataCache.fetchPromise;
        setState({
          data: dataCache.data,
          loading: false,
          error: dataCache.error
        });
        return;
      }

      // Start a new fetch
      dataCache.loading = true;
      setState(prev => ({ ...prev, loading: true }));

      const fetchPromise = (async () => {
        try {
          const responses = await Promise.all(
            Object.entries(groupedURLs).map(async ([url, keys]) => {
              const res = await fetch(url);
              if (!res.ok) throw new Error(`Error de conexión: ${url}`);
              const result = await res.json();
              // Extract only the needed data
              return keys.reduce((acc, key) => {
                acc[key] = result[key] as DeviceData;
                return acc;
              }, {} as Record<string, DeviceData>);
            })
          );
          
          // Combine all results into a single object
          dataCache.data = Object.assign({}, ...responses);
          dataCache.lastFetched = now;
          dataCache.error = null;
        } catch (err) {
          dataCache.error = 'Error al obtener datos';
        } finally {
          dataCache.loading = false;
          dataCache.fetchPromise = null;
          setState({
            data: dataCache.data,
            loading: false,
            error: dataCache.error
          });
        }
      })();

      dataCache.fetchPromise = fetchPromise;
      await fetchPromise;
    };

    fetchData();

    // Set up interval for periodic refreshes
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => {
      clearInterval(interval);
      dataCache.subscribers--;
      
      // If there are no more subscribers, clear the cache
      if (dataCache.subscribers === 0) {
        dataCache.data = {};
        dataCache.lastFetched = 0;
        dataCache.error = null;
        dataCache.fetchPromise = null;
      }
    };
  }, [codigoAsada]);

  return state;
}
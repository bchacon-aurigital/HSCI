import { useState, useEffect } from 'react';
import { DeviceData } from '../app/types/types';

let groupedURLs: Record<string, string[]> = {};

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
    setGroupedURLsForAsada(codigoAsada);
    
    dataCache.subscribers++;

    const fetchData = async () => {
      const now = Date.now();
      if (now - dataCache.lastFetched < 2 * 60 * 1000 && Object.keys(dataCache.data).length > 0) {
        setState({
          data: dataCache.data,
          loading: false,
          error: dataCache.error
        });
        return;
      }

      if (dataCache.fetchPromise) {
        await dataCache.fetchPromise;
        setState({
          data: dataCache.data,
          loading: false,
          error: dataCache.error
        });
        return;
      }

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

    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => {
      clearInterval(interval);
      dataCache.subscribers--;
      
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
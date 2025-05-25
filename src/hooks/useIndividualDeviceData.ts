// useIndividualDeviceData.ts
import { useState, useEffect, useRef } from 'react';

// Cache de datos para uso compartido entre hooks
const deviceDataCache: Record<string, {
  data: any,
  lastFetched: number,
  loading: boolean,
  error: string | null,
  fetchPromise: Promise<any> | null,
  subscribers: number,
  updateListeners: Set<() => void>
}> = {};

const globalTimers: Record<string, NodeJS.Timeout> = {};

let refreshInterval = 5 * 60 * 1000;
let isRealTimeMode = false;

export const setRealTimeModeForDevices = (enabled: boolean) => {
  if (isRealTimeMode === enabled) return;

  console.log(`Dispositivos individuales - Modo tiempo real: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
  isRealTimeMode = enabled;
  refreshInterval = enabled ? 2000 : 5 * 60 * 1000; 

  Object.keys(globalTimers).forEach(cacheKey => {
    if (globalTimers[cacheKey]) {
      clearInterval(globalTimers[cacheKey]);
      delete globalTimers[cacheKey];
    }
  });

  Object.keys(deviceDataCache).forEach(cacheKey => {
    if (deviceDataCache[cacheKey].subscribers > 0) {
      deviceDataCache[cacheKey].lastFetched = 0;
      triggerRefreshForDevice(cacheKey).then(() => {
        if (deviceDataCache[cacheKey].subscribers > 0) {
          globalTimers[cacheKey] = setInterval(() => {
            triggerRefreshForDevice(cacheKey);
          }, refreshInterval);
        }
      });
    }
  });

  console.log(`Dispositivos individuales - Intervalo: ${refreshInterval / 1000}s`);
};

export const triggerRefreshForDevice = async (cacheKey: string) => {
  if (!deviceDataCache[cacheKey]) return;
  
  if (deviceDataCache[cacheKey].fetchPromise) {
    return deviceDataCache[cacheKey].fetchPromise;
  }

  console.log(`Actualizando dispositivo: ${cacheKey}`);
  return fetchDeviceData(cacheKey);
};

const subscribeToDeviceUpdates = (cacheKey: string, callback: () => void) => {
  if (!deviceDataCache[cacheKey]) {
    deviceDataCache[cacheKey] = {
      data: null,
      lastFetched: 0,
      loading: false,
      error: null,
      fetchPromise: null,
      subscribers: 0,
      updateListeners: new Set()
    };
  }
  
  deviceDataCache[cacheKey].updateListeners.add(callback);
  return () => {
    deviceDataCache[cacheKey]?.updateListeners.delete(callback);
  };
};

const notifyDeviceUpdateListeners = (cacheKey: string) => {
  if (!deviceDataCache[cacheKey]) return;
  
  setTimeout(() => {
    deviceDataCache[cacheKey].updateListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error en listener de actualización de dispositivo:', error);
      }
    });
  }, 0);
};

const fetchDeviceData = async (cacheKey: string) => {
  if (!deviceDataCache[cacheKey]) return;
  
  const now = Date.now();
  const cache = deviceDataCache[cacheKey];

  if (!isRealTimeMode && now - cache.lastFetched < refreshInterval && cache.data !== null) {
    return;
  }

  if (cache.loading) {
    return cache.fetchPromise;
  }

  cache.loading = true;
  console.log(`Obteniendo datos de dispositivo ${isRealTimeMode ? '(tiempo real)' : ''}: ${cacheKey}`);

  const [url, pumpKey] = cacheKey.split('::');

  const fetchPromise = (async () => {
    try {
      const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${now}`;
      const res = await fetch(cacheBustUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!res.ok) throw new Error(`Error de conexión: ${res.status}`);
      const result = await res.json();
      
      const deviceData = pumpKey ? { ...result, valor: result[pumpKey] } : result;
      
      if (isRealTimeMode) {
        cache.data = deviceData;
        cache.lastFetched = now;
        cache.error = null;
        notifyDeviceUpdateListeners(cacheKey);
        return;
      }

      const hasChanged = JSON.stringify(deviceData) !== JSON.stringify(cache.data);

      if (hasChanged || cache.data === null) {
        cache.data = deviceData;
        notifyDeviceUpdateListeners(cacheKey);
      } else {
        console.log(`Sin cambios en dispositivo: ${cacheKey}`);
      }

      cache.lastFetched = now;
      cache.error = null;
      
    } catch (err) {
      console.error(`Error al obtener datos del dispositivo ${cacheKey}:`, err);
      cache.error = 'Error al obtener datos';
      notifyDeviceUpdateListeners(cacheKey);
    } finally {
      cache.loading = false;
      cache.fetchPromise = null;
    }
  })();

  cache.fetchPromise = fetchPromise;
  return fetchPromise;
};

export function useIndividualDeviceData(url: string, pumpKey?: string) {
  const cacheKey = `${url}${pumpKey ? '::' + pumpKey : ''}`;
  
  const [state, setState] = useState<{
    data: any,
    loading: boolean,
    error: string | null
  }>(() => {
    const cache = deviceDataCache[cacheKey];
    return {
      data: cache?.data || null,
      loading: cache?.loading || true,
      error: cache?.error || null
    };
  });

  useEffect(() => {
    if (!deviceDataCache[cacheKey]) {
      deviceDataCache[cacheKey] = {
        data: null,
        lastFetched: 0,
        loading: false,
        error: null,
        fetchPromise: null,
        subscribers: 0,
        updateListeners: new Set()
      };
    }

    deviceDataCache[cacheKey].subscribers++;

    const updateState = () => {
      const cache = deviceDataCache[cacheKey];
      setState(prevState => {
        if (
          cache.data !== prevState.data ||
          cache.loading !== prevState.loading ||
          cache.error !== prevState.error
        ) {
          return {
            data: cache.data,
            loading: cache.loading,
            error: cache.error
          };
        }
        return prevState;
      });
    };

    const unsubscribe = subscribeToDeviceUpdates(cacheKey, updateState);

    if (!globalTimers[cacheKey]) {
      fetchDeviceData(cacheKey).then(updateState);

      globalTimers[cacheKey] = setInterval(() => {
        fetchDeviceData(cacheKey);
      }, refreshInterval);
      console.log(`Timer configurado para dispositivo ${cacheKey} con intervalo de ${refreshInterval / 1000}s`);
    } else {
      updateState();
    }

    return () => {
      unsubscribe();
      deviceDataCache[cacheKey].subscribers--;

      if (deviceDataCache[cacheKey].subscribers === 0) {
        if (globalTimers[cacheKey]) {
          clearInterval(globalTimers[cacheKey]);
          delete globalTimers[cacheKey];
        }

        delete deviceDataCache[cacheKey];
      }
    };
  }, [url, pumpKey, cacheKey]);

  return { data: state.data, loading: state.loading, error: state.error };
}

// useIndividualDeviceData.ts
import { useState, useEffect, useRef } from 'react';

// Cache de datos para uso compartido entre hooks
const deviceDataCache: Record<string, {
  data: any,
  lastFetched: number,
  fetchPromise: Promise<any> | null
}> = {};

// Timer compartido para todos los hooks
const timers: Record<string, NodeJS.Timeout> = {};

export function useIndividualDeviceData(url: string, pumpKey?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<any>(null);
  
  // Clave única para este hook basada en URL y pumpKey
  const cacheKey = `${url}${pumpKey ? '::' + pumpKey : ''}`;

  useEffect(() => {
    const fetchData = async () => {
      // Verificar si hay una petición en curso
      if (deviceDataCache[cacheKey]?.fetchPromise) {
        try {
          await deviceDataCache[cacheKey].fetchPromise;
          const cachedData = deviceDataCache[cacheKey].data;
          if (JSON.stringify(cachedData) !== JSON.stringify(dataRef.current)) {
            setData(cachedData);
            dataRef.current = cachedData;
          }
          setError(null);
          setLoading(false);
        } catch (err) {
          setError('Error al obtener datos');
          setLoading(false);
        }
        return;
      }
      
      // Verificar si existe en caché y no ha expirado (5 minutos)
      const now = Date.now();
      if (deviceDataCache[cacheKey] && now - deviceDataCache[cacheKey].lastFetched < 5 * 60 * 1000) {
        const cachedData = deviceDataCache[cacheKey].data;
        if (JSON.stringify(cachedData) !== JSON.stringify(dataRef.current)) {
          setData(cachedData);
          dataRef.current = cachedData;
        }
        setError(null);
        setLoading(false);
        return;
      }

      // Si no hay datos en caché o han expirado, hacer nueva petición
      try {
        setLoading(true);
        
        // Crear y almacenar la promesa
        const fetchPromise = (async () => {
          // Añadir parámetro para evitar caché
          const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${now}`;
          const res = await fetch(cacheBustUrl, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          
          if (!res.ok) throw new Error('Error de conexión');
          const result = await res.json();
          
          // Si se especifica pumpKey, extrae ese dato; de lo contrario, retorna el objeto completo
          const deviceData = pumpKey ? { ...result, valor: result[pumpKey] } : result;
          
          // Actualizar caché
          deviceDataCache[cacheKey] = {
            data: deviceData,
            lastFetched: now,
            fetchPromise: null
          };
          
          return deviceData;
        })();
        
        // Guardar la promesa en la caché
        if (!deviceDataCache[cacheKey]) {
          deviceDataCache[cacheKey] = {
            data: null,
            lastFetched: 0,
            fetchPromise
          };
        } else {
          deviceDataCache[cacheKey].fetchPromise = fetchPromise;
        }
        
        // Esperar a que se complete
        const deviceData = await fetchPromise;
        
        // Actualizar estado si los datos cambiaron
        if (JSON.stringify(deviceData) !== JSON.stringify(dataRef.current)) {
          setData(deviceData);
          dataRef.current = deviceData;
        }
        setError(null);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('Error al obtener datos');
        
        // Limpiar caché en caso de error
        if (deviceDataCache[cacheKey]) {
          deviceDataCache[cacheKey].fetchPromise = null;
        }
      } finally {
        setLoading(false);
      }
    };

    // Iniciar fetching al montar
    fetchData();
    
    // Configurar timer para actualizaciones periódicas
    if (!timers[cacheKey]) {
      timers[cacheKey] = setInterval(fetchData, 5 * 60 * 1000); // 5 minutos
    }
    
    // Limpiar al desmontar
    return () => {
      if (timers[cacheKey]) {
        // Solo limpiar el timer si es el último suscriptor
        const subscriberCount = document.querySelectorAll(`[data-device="${url}"]`).length;
        if (subscriberCount <= 1) {
          clearInterval(timers[cacheKey]);
          delete timers[cacheKey];
        }
      }
    };
  }, [url, pumpKey, cacheKey]);

  return { data, loading, error };
}

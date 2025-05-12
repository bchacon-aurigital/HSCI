import { useState, useEffect } from 'react';
import { DeviceData } from '../app/types/types';

let groupedURLs: Record<string, string[]> = {};
// Variable global para controlar el intervalo de actualización
let refreshInterval = 5 * 60 * 1000; // 5 minutos por defecto
let isRealTimeMode = false;

// Un solo timer global
let globalTimerRef: NodeJS.Timeout | null = null;

// Función para activar/desactivar el modo tiempo real
export const setRealTimeMode = (enabled: boolean) => {
  // No hacer nada si el estado no cambia
  if (isRealTimeMode === enabled) return;
  
  console.log(`Cambiando modo tiempo real: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
  isRealTimeMode = enabled;
  refreshInterval = enabled ? 2000 : 5 * 60 * 1000; // 2 segundos en tiempo real, 5 minutos normalmente
  
  // Limpiar cualquier timer existente
  if (globalTimerRef) {
    console.log('Eliminando timer existente');
    clearInterval(globalTimerRef);
    globalTimerRef = null;
  }
  
  // Forzar actualización inmediata
  if (dataCache.subscribers > 0) {
    console.log(`Forzando actualización inmediata, modo tiempo real: ${enabled}`);
    dataCache.lastFetched = 0; // Forzar actualización
    triggerRefresh().then(() => {
      // Configurar nuevo timer con la frecuencia correcta si seguimos teniendo suscriptores
      if (dataCache.subscribers > 0) {
        console.log(`Configurando nuevo timer con intervalo de ${refreshInterval/1000}s`);
        globalTimerRef = setInterval(() => {
          triggerRefresh();
        }, refreshInterval);
      }
    });
  }
  
  console.log(`Modo tiempo real: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}, intervalo: ${refreshInterval/1000}s`);
};

// Función para forzar una actualización de datos
export const triggerRefresh = async () => {
  if (dataCache.fetchPromise) {
    return dataCache.fetchPromise;
  }
  
  console.log('Actualizando datos...');
  return fetchAggregatedData();
};

export const setGroupedURLsForAsada = (asadaCode: string) => {
  // No cambiar las URLs si ya están configuradas para la misma ASADA
  if (dataCache.currentAsada === asadaCode && Object.keys(groupedURLs).length > 0) {
    return;
  }
  
  dataCache.currentAsada = asadaCode;
  console.log(`Configurando URLs para ASADA: ${asadaCode}`);
  
  switch (asadaCode) {
    case 'codigo1':
      groupedURLs = {
        'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/.json': [
          'MONTANA', 'VTBC1', 'VTBC2', 'VLST1', 'POZOVERDE', 'VLMT1', 'VLMT2', 'GEMELOS'
        ]
      };
      break;
    case 'asroa2537':
      groupedURLs = {
        'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASROA/.json': [
          'OJO', 'ROD', 'SACRA', 'SONIA', 'BAJOPAI', 'JULIO', 'MELI', 'ZSG', 'VICTORJ', 'OCCI', 
        ]
      };
      break;
    case 'codigo2':
      groupedURLs = {
        'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/.json': [
          'CATSA_R'
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
  updateListeners: Set<() => void>;
  currentAsada: string | null;
} = {
  data: {},
  lastFetched: 0,
  loading: false,
  error: null,
  fetchPromise: null,
  subscribers: 0,
  updateListeners: new Set(),
  currentAsada: null
};

// Función para suscribirse a actualizaciones de datos
export const subscribeToDataUpdates = (callback: () => void) => {
  dataCache.updateListeners.add(callback);
  return () => {
    dataCache.updateListeners.delete(callback);
  };
};

// Función para notificar a todos los suscriptores sobre actualizaciones
const notifyUpdateListeners = () => {
  // Usar un setTimeout para evitar actualizaciones sincronizadas
  // que pueden causar problemas de renderizado
  setTimeout(() => {
    console.log(`Notificando a ${dataCache.updateListeners.size} suscriptores sobre actualización de datos`);
    dataCache.updateListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error en listener de actualización:', error);
      }
    });
  }, 0);
};

// Función para obtener datos de forma centralizada
const fetchAggregatedData = async () => {
  const now = Date.now();
  
  // Si estamos en modo tiempo real, siempre obtener datos frescos
  // De lo contrario, verificar si los datos son recientes
  if (!isRealTimeMode && now - dataCache.lastFetched < refreshInterval && Object.keys(dataCache.data).length > 0) {
    return;
  }

  // No hacer nada si no hay URLs configuradas
  if (Object.keys(groupedURLs).length === 0) {
    return;
  }
  
  // Si ya estamos cargando, no iniciar otra petición
  if (dataCache.loading) {
    return dataCache.fetchPromise;
  }

  dataCache.loading = true;
  console.log(`Iniciando obtención de datos ${isRealTimeMode ? '(tiempo real)' : ''}`);
  
  const fetchPromise = (async () => {
    try {
      const responses = await Promise.all(
        Object.entries(groupedURLs).map(async ([url, keys]) => {
          // Añadir parámetro de tiempo para evitar caché en navegador
          const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${now}`;
          const res = await fetch(cacheBustUrl, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          
          if (!res.ok) throw new Error(`Error de conexión: ${url}`);
          const result = await res.json();
          
          // Extract only the needed data
          return keys.reduce((acc, key) => {
            if (result && result[key]) {
              acc[key] = result[key];
            }
            return acc;
          }, {} as Record<string, DeviceData>);
        })
      );
      
      // Combinar respuestas
      const combinedData = Object.assign({}, ...responses);
      
      // En modo tiempo real, siempre actualizar los datos independientemente 
      // de si cambiaron o no, para garantizar flujo de datos
      if (isRealTimeMode) {
        dataCache.data = combinedData;
        dataCache.lastFetched = now;
        dataCache.error = null;
        console.log(`Datos actualizados en modo tiempo real, notificando a ${dataCache.updateListeners.size} suscriptores`);
        notifyUpdateListeners();
        return;
      }
      
      // En modo normal, verificar si los datos realmente cambiaron
      // Comparar solo las propiedades relevantes para detectar cambios
      let hasChanged = false;
      
      // Revisar si hay claves nuevas o si valores existentes cambiaron
      for (const key in combinedData) {
        // Si la clave no existe en el caché o los valores son diferentes
        if (!dataCache.data[key] || 
            JSON.stringify(combinedData[key]) !== JSON.stringify(dataCache.data[key])) {
          hasChanged = true;
          break;
        }
      }
      
      // Revisar si hay claves que ya no existen
      if (!hasChanged) {
        for (const key in dataCache.data) {
          if (!combinedData[key]) {
            hasChanged = true;
            break;
          }
        }
      }
      
      // Solo actualizar si hay cambios
      if (hasChanged) {
        dataCache.data = combinedData;
        console.log('Datos actualizados correctamente, notificando a', dataCache.updateListeners.size, 'suscriptores');
        // Notificar a los suscriptores sobre la actualización
        notifyUpdateListeners();
      } else {
        console.log('Sin cambios en los datos');
      }
      
      dataCache.lastFetched = now;
      dataCache.error = null;
    } catch (err) {
      console.error('Error al obtener datos:', err);
      dataCache.error = 'Error al obtener datos';
    } finally {
      dataCache.loading = false;
      dataCache.fetchPromise = null;
    }
  })();

  dataCache.fetchPromise = fetchPromise;
  return fetchPromise;
};

export function useAggregatedData(codigoAsada: string) {
  const [state, setState] = useState({
    data: dataCache.data,
    loading: dataCache.loading,
    error: dataCache.error
  });

  useEffect(() => {
    setGroupedURLsForAsada(codigoAsada);
    
    dataCache.subscribers++;
    console.log(`Nuevo suscriptor para ${codigoAsada} (total: ${dataCache.subscribers})`);
    
    // Función para actualizar el estado local con los datos más recientes
    const updateState = () => {
      // Actualizar con los datos más recientes
      setState(prevState => {
        // Solo actualizar si realmente hay cambios para evitar re-renderizados
        if (
          dataCache.data !== prevState.data ||
          dataCache.loading !== prevState.loading ||
          dataCache.error !== prevState.error
        ) {
          return {
            data: dataCache.data,
            loading: dataCache.loading,
            error: dataCache.error
          };
        }
        return prevState; // No hay cambios, mantener el estado anterior
      });
    };
    
    // Suscribirse a las actualizaciones de datos
    const unsubscribe = subscribeToDataUpdates(updateState);

    // Iniciar la obtención de datos solo si no hay un timer global
    if (!globalTimerRef) {
      fetchAggregatedData().then(updateState);
      
      // Configurar intervalo solo si no hay uno existente
      globalTimerRef = setInterval(() => {
        fetchAggregatedData();
      }, refreshInterval);
      console.log(`Timer global configurado con intervalo de ${refreshInterval/1000}s`);
    } else {
      // Si ya hay datos, actualizar el estado
      updateState();
    }

    return () => {
      unsubscribe();
      dataCache.subscribers--;
      console.log(`Suscriptor para ${codigoAsada} eliminado (quedan: ${dataCache.subscribers})`);
      
      if (dataCache.subscribers === 0) {
        // Limpiar el intervalo global si no hay más suscriptores
        if (globalTimerRef) {
          clearInterval(globalTimerRef);
          globalTimerRef = null;
          console.log('Timer global eliminado por falta de suscriptores');
        }
        
        // Limpiar datos si no hay más suscriptores
        dataCache.data = {};
        dataCache.lastFetched = 0;
        dataCache.error = null;
        dataCache.fetchPromise = null;
        dataCache.currentAsada = null;
        console.log('Cache limpiado por falta de suscriptores');
      }
    };
  }, [codigoAsada]);

  return state;
}
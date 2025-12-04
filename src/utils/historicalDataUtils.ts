import { HistoricalConfig } from '../app/types/types';

export async function hasHistoricalData(codigoAsada: string, historicoKey?: string, databaseKey?: string, deviceType?: string, historicalConfig?: HistoricalConfig): Promise<boolean> {
  try {
    if (!codigoAsada) {
      console.error('Código de ASADA no proporcionado');
      return false;
    }
    
    if (!databaseKey) {
      console.error('Base de datos no proporcionada');
      return false;
    }
    
    const keyToUse = historicoKey;

    // Determinar qué ubicaciones intentar según el tipo de dispositivo
    let locationsToTry = [];

    // Si el device tiene configuración custom y no usa subfolders
    if (historicalConfig && !historicalConfig.useSubfolders) {
      locationsToTry = [''];  // Sin subfolder adicional
    } else if (deviceType === 'pump' || deviceType === 'well' || deviceType === 'centrifugal') {
      // Para bombas y pozos, intentar primero ESTADOBOMBA, luego NIVELES
      locationsToTry = ['ESTADOBOMBA', 'NIVELES'];
    } else if (deviceType === 'valve') {
      // Para válvulas, intentar ESTADOVALVULA, luego NIVELES
      locationsToTry = ['ESTADOVALVULA', 'NIVELES'];
    } else if (deviceType === 'pressure') {
      // Para dispositivos de presión, intentar PRESION, luego NIVELES
      locationsToTry = ['PRESION'];
    } else if (deviceType === 'multi') {
      // Para dispositivos multi, intentar todas las ubicaciones posibles
      locationsToTry = ['ESTADOBOMBA', 'NIVELES', 'ESTADOVALVULA', 'PRESION'];
    } else {
      // Para tanques, intentar primero NIVELES, luego ESTADOBOMBA
      locationsToTry = ['NIVELES', 'ESTADOBOMBA'];
    }

    // Intentar cada ubicación hasta encontrar datos
    for (const subfolder of locationsToTry) {
      // Construir URL basada en configuración del device o defaults
      let url: string;
      if (historicalConfig) {
        // Usar configuración custom del device
        const authParam = historicalConfig.authToken ? `?auth=${historicalConfig.authToken}` : '';
        url = `${historicalConfig.baseUrl}${historicalConfig.historicalDataPath}${databaseKey}/${keyToUse}.json${authParam}`;
      } else {
        // Usar configuración por defecto (prueba-labview)
        url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${keyToUse}/${subfolder}.json`;
      }

      try {
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data !== null && data !== undefined) {
            return true;
          }
        }
      } catch (error) {
        // Continuar con la siguiente ubicación
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error al verificar datos históricos para ${codigoAsada} con clave ${historicoKey}:`, error);
    return false;
  }
}

const historicalDataCache: Record<string, boolean> = {};

export async function checkHistoricalDataAvailability(codigoAsada: string, historicoKey?: string, databaseKey?: string, deviceType?: string, historicalConfig?: HistoricalConfig): Promise<boolean> {
  if (!codigoAsada) {
    return false;
  }

  if (!databaseKey) {
    return false;
  }

  if (!historicoKey) {
    return false;
  }

  const cacheKey = `${databaseKey}_${historicoKey ? `${codigoAsada}_${historicoKey}_${deviceType || 'unknown'}` : codigoAsada}`;

  if (historicalDataCache[cacheKey] !== undefined) {
    return historicalDataCache[cacheKey];
  }

  try {
    const hasData = await hasHistoricalData(codigoAsada, historicoKey, databaseKey, deviceType, historicalConfig);
    historicalDataCache[cacheKey] = hasData;
    return hasData;
  } catch (error) {
    console.error(`Error al verificar disponibilidad de datos históricos para ${codigoAsada} con clave ${historicoKey}:`, error);
    historicalDataCache[cacheKey] = false;
    return false;
  }
}

export function clearHistoricalDataCache(codigoAsada?: string, historicoKey?: string, databaseKey?: string): void {
  // Si no hay databaseKey, no hacemos nada
  if (!databaseKey) {
    return;
  }
  
  if (codigoAsada) {
    if (historicoKey) {
      delete historicalDataCache[`${databaseKey}_${codigoAsada}_${historicoKey}`];
      delete historicalDataCache[`${databaseKey}_${codigoAsada}`];
    } else {
      Object.keys(historicalDataCache).forEach(key => {
        if (key.includes(`${databaseKey}_${codigoAsada}`) || key === `${databaseKey}_${codigoAsada}`) {
          delete historicalDataCache[key];
        }
      });
    }
  } else {
    // Solo limpiar las entradas para la base de datos específica
    Object.keys(historicalDataCache).forEach(key => {
      if (key.startsWith(`${databaseKey}_`)) {
        delete historicalDataCache[key];
      }
    });
  }
}
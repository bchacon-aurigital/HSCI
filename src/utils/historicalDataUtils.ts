export async function hasHistoricalData(codigoAsada: string, historicoKey?: string, databaseKey?: string): Promise<boolean> {
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
    
    const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${keyToUse}/NIVELES.json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Error de red al verificar históricos: ${response.status}`);
      throw new Error(`Error de red: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data !== null && data !== undefined;
  } catch (error) {
    console.error(`Error al verificar datos históricos para ${codigoAsada} con clave ${historicoKey}:`, error);
    return false;
  }
}

const historicalDataCache: Record<string, boolean> = {};

export async function checkHistoricalDataAvailability(codigoAsada: string, historicoKey?: string, databaseKey?: string): Promise<boolean> {
  if (!codigoAsada) {
    return false;
  }
  
  if (!databaseKey) {
    return false;
  }
  
  if (!historicoKey) {
    return false;
  }
  
  const cacheKey = `${databaseKey}_${historicoKey ? `${codigoAsada}_${historicoKey}` : codigoAsada}`;
  
  if (historicalDataCache[cacheKey] !== undefined) {
    return historicalDataCache[cacheKey];
  }
  
  try {
    const hasData = await hasHistoricalData(codigoAsada, historicoKey, databaseKey);
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
export async function hasHistoricalData(codigoAsada: string, historicoKey?: string): Promise<boolean> {
  try {
    if (!codigoAsada) {
      console.error('Código de ASADA no proporcionado');
      return false;
    }
    
    const keyToUse = historicoKey;
    
    const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASROA/HISTORICO/${keyToUse}/NIVELES.json`;
    console.log(`Verificando datos históricos para ASADA: ${codigoAsada} con clave: ${keyToUse}`);
    
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

const historicalDataCache: Record<string, boolean> = {
  'ASROA': true  
};

export async function checkHistoricalDataAvailability(codigoAsada: string, historicoKey?: string): Promise<boolean> {
  if (!codigoAsada) {
    return false;
  }
  
  const cacheKey = historicoKey ? `${codigoAsada}_${historicoKey}` : codigoAsada;
  
  if (historicalDataCache[cacheKey] !== undefined) {
    return historicalDataCache[cacheKey];
  }
  
  try {
    const hasData = await hasHistoricalData(codigoAsada, historicoKey);
    historicalDataCache[cacheKey] = hasData;
    return hasData;
  } catch (error) {
    console.error(`Error al verificar disponibilidad de datos históricos para ${codigoAsada} con clave ${historicoKey}:`, error);
    historicalDataCache[cacheKey] = false;
    return false;
  }
}

export function clearHistoricalDataCache(codigoAsada?: string, historicoKey?: string): void {
  if (codigoAsada) {
    if (historicoKey) {
      delete historicalDataCache[`${codigoAsada}_${historicoKey}`];
      delete historicalDataCache[codigoAsada];
    } else {
      Object.keys(historicalDataCache).forEach(key => {
        if (key === codigoAsada || key.startsWith(`${codigoAsada}_`)) {
          delete historicalDataCache[key];
        }
      });
    }
  } else {
    Object.keys(historicalDataCache).forEach(key => {
      if (key !== 'ASROA' && !key.startsWith('ASROA_')) {
        delete historicalDataCache[key];
      }
    });
  }
}
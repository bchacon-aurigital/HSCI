// Función para verificar si una ASADA tiene datos históricos disponibles
export async function hasHistoricalData(codigoAsada: string): Promise<boolean> {
  try {
    // Ahora solo verificamos a nivel de ASADA, no a nivel de dispositivo
    const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASROA/HISTORICO/BP/NIVELES.json`;
    console.log(`Verificando datos históricos a nivel de ASADA`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Error de red al verificar históricos: ${response.status}`);
      throw new Error(`Error de red: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar si existe la estructura de datos históricos
    return !!data;
  } catch (error) {
    console.error('Error al verificar datos históricos:', error);
    return false;
  }
}

// Cache para almacenar resultados de verificación y evitar peticiones repetidas
const historicalDataCache: Record<string, boolean> = {
  'ASROA': true  // Inicializar con ASROA disponible
};

// Función con caché para verificar datos históricos
export async function checkHistoricalDataAvailability(codigoAsada: string): Promise<boolean> {
  // Simplificación: siempre devolver true para ASROA
  if (codigoAsada === 'ASROA') {
    return true;
  }
  
  // Para otras ASADAS, usar la caché
  if (historicalDataCache[codigoAsada] !== undefined) {
    return historicalDataCache[codigoAsada];
  }
  
  // Para simplificar, por ahora solo ASROA tiene históricos
  historicalDataCache[codigoAsada] = false;
  return false;
}

// Función para limpiar la caché (útil si se quiere verificar nuevamente)
export function clearHistoricalDataCache(codigoAsada?: string): void {
  if (codigoAsada) {
    delete historicalDataCache[codigoAsada];
  } else {
    // Si no se especifica una ASADA, limpiar toda la caché excepto ASROA que siempre está disponible
    Object.keys(historicalDataCache).forEach(key => {
      if (key !== 'ASROA') {
        delete historicalDataCache[key];
      }
    });
  }
} 
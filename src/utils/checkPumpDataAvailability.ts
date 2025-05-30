// utils/checkPumpDataAvailability.ts

/**
 * Verifica si existen datos históricos de estado de bombas para un dispositivo
 * @param databaseKey - Clave de la base de datos
 * @param historicoKey - Clave histórica del dispositivo
 * @returns Promise<boolean> - true si hay datos de bombas disponibles
 */
export const checkPumpDataAvailability = async (
    databaseKey: string,
    historicoKey: string
  ): Promise<boolean> => {
    if (!databaseKey || !historicoKey) {
      return false;
    }
  
    try {
      // Obtener fecha actual para verificar datos recientes
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      // Intentar verificar los últimos 7 días
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - dayOffset);
        
        const checkYear = checkDate.getFullYear();
        const checkMonth = checkDate.getMonth() + 1;
        const checkDay = checkDate.getDate();
        
        const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/ESTADOBOMBA/${checkYear}/${checkMonth}/${checkDay}.json`;
        
        try {
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            // Si hay datos, retornar true
            if (data && Object.keys(data).length > 0) {
              console.log(`Datos de bombas encontrados para ${historicoKey} en ${checkDay}/${checkMonth}/${checkYear}`);
              return true;
            }
          }
        } catch (error) {
          // Continuar con el siguiente día si hay error
          continue;
        }
      }
      
      // Si no se encontraron datos en los últimos 7 días, verificar estructura general
      const generalUrl = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/ESTADOBOMBA.json`;
      
      try {
        const response = await fetch(generalUrl);
        if (response.ok) {
          const data = await response.json();
          return data !== null && Object.keys(data).length > 0;
        }
      } catch (error) {
        console.error('Error al verificar estructura general de bombas:', error);
      }
      
      return false;
    } catch (error) {
      console.error('Error al verificar disponibilidad de datos de bombas:', error);
      return false;
    }
  };
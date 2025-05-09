/**
 * Convierte un timestamp de LabVIEW (segundos desde 1904-01-01 00:00:00 UTC) a una fecha JavaScript
 * 
 * @param timeSec - El tiempo en segundos desde el epoch de LabVIEW
 * @returns Una instancia de Date con la hora correspondiente
 */
export const parseLabviewTime = (timeSec: number): Date => {
  // Epoch de LabVIEW: 1904-01-01 00:00:00 UTC
  const LABVIEW_EPOCH_MS = Date.UTC(1904, 0, 1, 0, 0, 0);
  // Convertir segundos a milisegundos y sumar al epoch
  return new Date(LABVIEW_EPOCH_MS + timeSec * 1000);
};

/**
 * Formatea un timestamp de LabVIEW a una cadena de hora local (HH:MM)
 * 
 * @param timeSec - El tiempo en segundos desde el epoch de LabVIEW
 * @returns Una cadena con el formato HH:MM
 */
export const formatLabviewTimeToHourMinute = (timeSec: number): string => {
  try {
    const date = parseLabviewTime(timeSec);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } catch (err) {
    console.error('Error al formatear timestamp:', err);
    return 'N/D';
  }
};

/**
 * Formatea un timestamp de LabVIEW a una cadena de fecha y hora local (DD/MM/YYYY HH:MM:SS)
 * 
 * @param timeSec - El tiempo en segundos desde el epoch de LabVIEW
 * @returns Una cadena con el formato DD/MM/YYYY HH:MM:SS
 */
export const formatLabviewTimeToFullDateTime = (timeSec: number): string => {
  try {
    const date = parseLabviewTime(timeSec);
    return date.toLocaleString('es-CR');
  } catch (err) {
    console.error('Error al formatear timestamp completo:', err);
    return 'N/D';
  }
}; 
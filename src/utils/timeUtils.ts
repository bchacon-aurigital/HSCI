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

/**
 * Formatea una fecha para usar en input type="date" (YYYY-MM-DD)
 *
 * @param date - La fecha a formatear
 * @returns Una cadena con el formato YYYY-MM-DD
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Genera un array de fechas entre start y end (inclusive)
 *
 * @param start - Fecha de inicio en formato YYYY-MM-DD
 * @param end - Fecha de fin en formato YYYY-MM-DD
 * @returns Array de fechas en formato YYYY-MM-DD
 */
export const generateDateArray = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(formatDateForInput(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Formatea una fecha para labels de gráfica multi-día: "DD/MM HH:mm"
 *
 * @param date - La fecha a formatear
 * @returns Una cadena con el formato DD/MM HH:mm
 */
export const formatDateTimeForChart = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
};

/**
 * Calcula la diferencia en días entre dos fechas
 *
 * @param start - Fecha de inicio en formato YYYY-MM-DD
 * @param end - Fecha de fin en formato YYYY-MM-DD
 * @returns Número de días de diferencia
 */
export const getDaysDifference = (start: string, end: string): number => {
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
};

/**
 * Agrega días a una fecha
 *
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param days - Número de días a agregar (puede ser negativo)
 * @returns Fecha resultante en formato YYYY-MM-DD
 */
export const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
};

/**
 * Obtiene el primer día del mes actual
 *
 * @returns Fecha del primer día del mes en formato YYYY-MM-DD
 */
export const getFirstDayOfMonth = (): string => {
  const date = new Date();
  date.setDate(1);
  return formatDateForInput(date);
};
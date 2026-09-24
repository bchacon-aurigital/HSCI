import { MultiDayDataPoint } from '../app/types/types';
import { parseLabviewTime } from './timeUtils';

/**
 * Determina el método de agregación según la cantidad de días
 *
 * @param dayCount - Número de días en el rango
 * @returns Método de agregación: 'none', 'hourly' o '2-hour'
 */
export const determineAggregation = (dayCount: number): 'none' | 'hourly' | '2-hour' => {
  if (dayCount <= 3) return 'none';
  if (dayCount <= 7) return 'hourly';
  return '2-hour';
};

/**
 * Calcula la moda (valor más frecuente) para datos de bombas
 *
 * @param values - Array de valores numéricos
 * @returns El valor más frecuente
 */
export const calculateMode = (values: number[]): number => {
  if (values.length === 0) return 0;

  const frequency: Record<number, number> = {};
  values.forEach(v => {
    frequency[v] = (frequency[v] || 0) + 1;
  });

  return Number(
    Object.keys(frequency).reduce((a, b) =>
      frequency[Number(a)] > frequency[Number(b)] ? a : b
    )
  );
};

/**
 * Agrupa datos por ventana de tiempo (hora o 2 horas)
 *
 * @param data - Array de puntos de datos multi-día
 * @param windowHours - Tamaño de la ventana en horas (1 o 2)
 * @param isPumpData - Si es true, usa moda en lugar de promedio
 * @returns Array de datos agregados
 */
export const aggregateByTimeWindow = (
  data: MultiDayDataPoint[],
  windowHours: number,
  isPumpData: boolean = false
): MultiDayDataPoint[] => {
  if (data.length === 0) return [];

  // Agrupar por ventana de tiempo
  const groups: { [key: string]: MultiDayDataPoint[] } = {};

  data.forEach(point => {
    const date = parseLabviewTime(point.timestamp);
    const windowKey = getWindowKey(date, windowHours);

    if (!groups[windowKey]) {
      groups[windowKey] = [];
    }
    groups[windowKey].push(point);
  });

  // Agregar cada grupo
  const aggregated: MultiDayDataPoint[] = [];

  Object.keys(groups).sort().forEach(key => {
    const groupPoints = groups[key];

    if (groupPoints.length === 0) return;

    // Usar el timestamp del primer punto del grupo
    const firstPoint = groupPoints[0];

    // Calcular valor agregado
    const value = isPumpData
      ? calculateMode(groupPoints.map(p => p.value))
      : calculateAverage(groupPoints.map(p => p.value));

    aggregated.push({
      timestamp: firstPoint.timestamp,
      value: value,
      date: firstPoint.date,
      aggregatedCount: groupPoints.length
    });
  });

  return aggregated;
};

/**
 * Agregar datos por hora
 *
 * @param data - Array de puntos de datos multi-día
 * @param isPumpData - Si es true, usa moda en lugar de promedio
 * @returns Array de datos agregados por hora
 */
export const aggregateByHour = (
  data: MultiDayDataPoint[],
  isPumpData: boolean = false
): MultiDayDataPoint[] => {
  return aggregateByTimeWindow(data, 1, isPumpData);
};

/**
 * Agregar datos por 2 horas
 *
 * @param data - Array de puntos de datos multi-día
 * @param isPumpData - Si es true, usa moda en lugar de promedio
 * @returns Array de datos agregados cada 2 horas
 */
export const aggregateBy2Hours = (
  data: MultiDayDataPoint[],
  isPumpData: boolean = false
): MultiDayDataPoint[] => {
  return aggregateByTimeWindow(data, 2, isPumpData);
};

/**
 * Genera una key única para agrupar por ventana de tiempo
 *
 * @param date - Fecha a procesar
 * @param windowHours - Tamaño de ventana en horas
 * @returns String key para agrupación
 */
const getWindowKey = (date: Date, windowHours: number): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = Math.floor(date.getHours() / windowHours) * windowHours;
  const hourStr = String(hour).padStart(2, '0');

  return `${year}-${month}-${day}_${hourStr}`;
};

/**
 * Calcula el promedio de un array de números
 *
 * @param values - Array de valores
 * @returns Promedio
 */
const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

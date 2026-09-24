// HistoricalChart.tsx - Versión corregida para zona horaria de Costa Rica
'use client';
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar, X, Info } from 'lucide-react';
import {
  formatLabviewTimeToHourMinute,
  formatLabviewTimeToFullDateTime,
  generateDateArray,
  formatDateTimeForChart,
  getDaysDifference,
  addDays,
  getFirstDayOfMonth,
  parseLabviewTime
} from '../utils/timeUtils';
import { HistoricalConfig, DateRange, MultiDayDataPoint } from '../app/types/types';
import { determineAggregation, aggregateByHour, aggregateBy2Hours } from '../utils/dataAggregation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler  
);

interface HistoricalChartProps {
  codigoAsada: string;
  deviceKey: string;
  historicoKey?: string;
  deviceName: string;
  onClose: () => void;
  databaseKey?: string;
  deviceType?: string;
  groupName?: string;
  historicalConfig?: HistoricalConfig;
  pressureUnit?: 'PSI' | 'L/s' | 'Bar';
}

// Función para obtener la fecha actual en Costa Rica
const getCostaRicaDate = () => {
  const now = new Date();
  // Costa Rica está en UTC-6 (CST)
  const costaRicaOffset = -6 * 60; // -6 horas en minutos
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const costaRicaTime = new Date(utc + (costaRicaOffset * 60000));
  return costaRicaTime;
};

// Función para formatear fecha para input date (YYYY-MM-DD) en zona horaria de Costa Rica
const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HistoricalChart({
  codigoAsada,
  deviceKey,
  historicoKey,
  deviceName,
  onClose,
  databaseKey,
  deviceType,
  groupName,
  historicalConfig,
  pressureUnit = 'PSI'
}: HistoricalChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  const dataMode: 'levels' | 'pumps' =
    (deviceType === 'pump' || deviceType === 'well') ? 'pumps' : 'levels';

  const [dateRange, setDateRange] = useState<DateRange>({
    start: formatDateForInput(getCostaRicaDate()),
    end: formatDateForInput(getCostaRicaDate()),
    mode: 'single'
  });

  const [loadingProgress, setLoadingProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const [aggregationInfo, setAggregationInfo] = useState<string | null>(null);

  // Detectar si estamos en un dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar al cargar
    checkIfMobile();
    
    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar el event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const parseSelectedDateInCostaRica = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const costaRicaOffset = -6 * 60;
    const costaRicaDate = new Date(utcDate.getTime() + (costaRicaOffset * 60000));
    
    return {
      year: costaRicaDate.getUTCFullYear(),
      month: costaRicaDate.getUTCMonth() + 1,
      day: costaRicaDate.getUTCDate()
    };
  };

  // Función para cargar datos según la fecha seleccionada y la pestaña activa
  const loadDataForDate = async (selectedDateString: string) => {
    const { year, month, day } = parseSelectedDateInCostaRica(selectedDateString);

    setLoading(true);
    setError(null);

    try {
      // Verificamos que existan tanto historicoKey como databaseKey
      if (!historicoKey) {
        setError('No hay clave histórica definida para este dispositivo');
        setLoading(false);
        return;
      }

      if (!databaseKey) {
        setError('No hay base de datos definida para este dispositivo');
        setLoading(false);
        return;
      }

      let dataType;
      if (dataMode === 'pumps') {
        dataType = 'ESTADOBOMBA';
      } else if (deviceType === 'pressure') {
        dataType = 'PRESION';
      } else {
        dataType = 'NIVELES';
      }

      // Preparar ambos formatos de fecha: con cero adelante y sin cero
      const monthPadded = String(month).padStart(2, '0');
      const dayPadded = String(day).padStart(2, '0');

      // Construir URLs con ambos formatos
      const urlsToTry: string[] = [];

      if (historicalConfig) {
        // Usar configuración custom del device
        const authParam = historicalConfig.authToken ? `?auth=${historicalConfig.authToken}` : '';
        // Primero intentar con ceros adelante
        urlsToTry.push(`${historicalConfig.baseUrl}${historicalConfig.historicalDataPath}${databaseKey}/${historicoKey}/${year}/${monthPadded}/${dayPadded}.json${authParam}`);
        // Luego intentar sin ceros
        urlsToTry.push(`${historicalConfig.baseUrl}${historicalConfig.historicalDataPath}${databaseKey}/${historicoKey}/${year}/${month}/${day}.json${authParam}`);
      } else {
        // Usar configuración por defecto (prueba-labview)
        // Primero intentar con ceros adelante
        urlsToTry.push(`https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/${dataType}/${year}/${monthPadded}/${dayPadded}.json`);
        // Luego intentar sin ceros
        urlsToTry.push(`https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/${dataType}/${year}/${month}/${day}.json`);
      }

      console.log(`Obteniendo datos de ${dataType} para ${day}/${month}/${year} (Costa Rica) desde API`);

      // Intentar con ambas URLs
      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const url of urlsToTry) {
        try {
          console.log(`Intentando URL: ${url}`);
          response = await fetch(url);

          if (response.ok) {
            // Verificar que los datos no sean null antes de aceptar esta URL
            const clonedResponse = response.clone();
            const testData = await clonedResponse.json();
            if (testData !== null && testData !== undefined) {
              break; // Si encuentra datos válidos, salir del loop
            }
            // Si los datos son null, continuar con la siguiente URL
            continue;
          } else if (response.status === 404) {
            // Si es 404, intentar con la siguiente URL
            continue;
          } else {
            throw new Error(`Error de red: ${response.status}`);
          }
        } catch (err: any) {
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        setChartData(null);
        setError(`No hay datos de ${dataMode === 'pumps' ? 'estado de bombas' : deviceType === 'pressure' ? 'presión' : 'niveles'} disponibles para ${day}/${month}/${year}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      processHistoricalData(data, historicoKey);

    } catch (error: any) {
      console.error('Error al cargar datos históricos:', error);
      setError(`Error al cargar datos: ${error.message || 'Error desconocido'}`);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar datos de un rango de fechas
  const fetchDateRangeData = async (startDate: string, endDate: string) => {
    // Validar rango
    const dayCount = getDaysDifference(startDate, endDate);

    if (dayCount > 30) {
      setError('El rango máximo es de 30 días. Por favor selecciona un período menor.');
      setLoading(false);
      return;
    }

    if (dayCount < 1) {
      setError('La fecha de inicio debe ser anterior o igual a la fecha final.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingProgress({ current: 0, total: dayCount });

    try {
      if (!historicoKey || !databaseKey) {
        setError('No hay configuración histórica para este dispositivo');
        setLoading(false);
        return;
      }

      // Generar array de fechas
      const dates = generateDateArray(startDate, endDate);

      // Crear promesas para fetch paralelo
      const fetchPromises = dates.map(async (dateString, index) => {
        try {
          const { year, month, day } = parseSelectedDateInCostaRica(dateString);

          let dataType;
          if (dataMode === 'pumps') {
            dataType = 'ESTADOBOMBA';
          } else if (deviceType === 'pressure') {
            dataType = 'PRESION';
          } else {
            dataType = 'NIVELES';
          }

          const monthPadded = String(month).padStart(2, '0');
          const dayPadded = String(day).padStart(2, '0');

          const urlsToTry: string[] = [];

          if (historicalConfig) {
            const authParam = historicalConfig.authToken ? `?auth=${historicalConfig.authToken}` : '';
            urlsToTry.push(`${historicalConfig.baseUrl}${historicalConfig.historicalDataPath}${databaseKey}/${historicoKey}/${year}/${monthPadded}/${dayPadded}.json${authParam}`);
            urlsToTry.push(`${historicalConfig.baseUrl}${historicalConfig.historicalDataPath}${databaseKey}/${historicoKey}/${year}/${month}/${day}.json${authParam}`);
          } else {
            urlsToTry.push(`https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/${dataType}/${year}/${monthPadded}/${dayPadded}.json`);
            urlsToTry.push(`https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/${dataType}/${year}/${month}/${day}.json`);
          }

          // Intentar ambas URLs
          for (const url of urlsToTry) {
            try {
              const response = await fetch(url);
              if (response.ok) {
                const data = await response.json();
                if (data !== null && data !== undefined) {
                  // Actualizar progreso
                  setLoadingProgress({ current: index + 1, total: dayCount });
                  return { date: dateString, data };
                }
              }
            } catch (err) {
              continue;
            }
          }

          // Si llegamos aquí, no se encontraron datos para esta fecha
          return { date: dateString, data: null };
        } catch (err) {
          return { date: dateString, data: null };
        }
      });

      // Ejecutar todas las promesas en paralelo
      const results = await Promise.allSettled(fetchPromises);

      // Filtrar resultados exitosos
      const successfulResults = results
        .filter((r): r is PromiseFulfilledResult<{ date: string; data: any }> => r.status === 'fulfilled' && r.value.data !== null)
        .map(r => r.value);

      const failedCount = dayCount - successfulResults.length;

      if (successfulResults.length === 0) {
        setError(`No se encontraron datos para el rango seleccionado (${startDate} - ${endDate})`);
        setChartData(null);
        setLoading(false);
        setLoadingProgress(null);
        return;
      }

      // Procesar datos multi-día
      processMultiDayData(successfulResults, historicoKey, dayCount, failedCount);

    } catch (error: any) {
      console.error('Error al cargar rango de datos:', error);
      setError(`Error al cargar datos: ${error.message || 'Error desconocido'}`);
      setChartData(null);
    } finally {
      setLoading(false);
      setLoadingProgress(null);
    }
  };

  const processHistoricalData = (data: any, deviceKey: string) => {
    const chartLabels: string[] = [];
    const chartValues: number[] = [];
    const chartTimeLabels: string[] = [];

    if (!data) {
      console.error('No hay datos para procesar');
      setError(`No hay datos de ${dataMode === 'pumps' ? 'estado de bombas' : deviceType === 'pressure' ? 'presión' : 'niveles'} disponibles para esta fecha`);
      setChartData(null);
      return;
    }
    
    // Determinar qué campo buscar en los datos
    let valueField = 'VALOR';
    if (dataMode === 'pumps') {
      valueField = 'ESTADO';
    } else if (deviceType === 'pressure') {
      // Para dispositivos de presión, intentar múltiples campos posibles
      valueField = 'PRESION_BAR';
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        if (item && item.DATA) {
          let fieldValue;

          // Para presión, intentar múltiples campos
          if (deviceType === 'pressure') {
            fieldValue = item.DATA.PRESION_BAR ?? item.DATA.PRESION ?? item.DATA.VALOR ?? item.DATA.CAUDAL_LPS;
          } else {
            fieldValue = item.DATA[valueField];
          }

          if (fieldValue !== undefined) {
            const timeLabel = item.DATA.TIME
              ? formatLabviewTimeToHourMinute(Number(item.DATA.TIME))
              : `Registro ${index + 1}`;
            chartLabels.push(`Toma ${index + 1} (${timeLabel})`);
            chartTimeLabels.push(timeLabel);
            chartValues.push(Number(fieldValue));
          }
        }
      });
    } else if (typeof data === 'object') {
      try {
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          if (value && value.DATA) {
            let fieldValue;

            // Para presión, intentar múltiples campos
            if (deviceType === 'pressure') {
              fieldValue = value.DATA.PRESION_BAR ?? value.DATA.PRESION ?? value.DATA.VALOR ?? value.DATA.CAUDAL_LPS;
            } else {
              fieldValue = value.DATA[valueField];
            }

            if (fieldValue !== undefined) {
              let timeLabel;
              if (value.DATA.TIME) {
                timeLabel = formatLabviewTimeToHourMinute(Number(value.DATA.TIME));
              } else {
                timeLabel = 'N/D';
              }

              let tomaLabel;
              if (key.startsWith('T')) {
                tomaLabel = key;
              } else {
                tomaLabel = `Toma ${key}`;
              }

              chartLabels.push(`${tomaLabel} (${timeLabel})`);
              chartTimeLabels.push(timeLabel);
              chartValues.push(Number(fieldValue));
            }
          }
        });
      } catch (error) {
        console.error('Error al procesar datos históricos:', error);
        setError(`Error al procesar datos: ${error.message || 'Error desconocido'}`);
        setChartData(null);
        return;
      }
    }

    const combinedData = chartLabels.map((label, i) => ({ label, value: chartValues[i] }));

    combinedData.sort((a, b) => {
      const tomaRegexA = a.label.match(/Toma (\d+)/);
      const tomaRegexB = b.label.match(/Toma (\d+)/);
      
      if (tomaRegexA && tomaRegexB) {
        return parseInt(tomaRegexA[1], 10) - parseInt(tomaRegexB[1], 10);
      }


      const tRegexA = a.label.match(/^T(\d+)/);
      const tRegexB = b.label.match(/^T(\d+)/);

      if (tRegexA && tRegexB) {
        return parseInt(tRegexA[1], 10) - parseInt(tRegexB[1], 10);
      }

      return a.label.localeCompare(b.label);
    });

    const sortedLabels = combinedData.map(d => d.label);
    const sortedValues = combinedData.map(d => d.value);
    
    const isPumpData = dataMode === 'pumps';
    const realStates = isPumpData ? [...sortedValues] : [];
    const displayValues = isPumpData ? sortedValues.map(() => 1) : sortedValues; 
    let backgroundColors, borderColors;
    
    if (isPumpData) {
      const stateColors = {
        0: 'rgba(59, 130, 246, 0.8)',
        1: 'rgba(34, 197, 94, 0.8)',
        2: 'rgba(239, 68, 68, 0.8)',
        3: 'rgba(156, 163, 175, 0.8)'
      };
      const stateBorderColors = {
        0: 'rgb(59, 130, 246)',
        1: 'rgb(34, 197, 94)',
        2: 'rgb(239, 68, 68)',
        3: 'rgb(156, 163, 175)'
      };
      
      backgroundColors = realStates.map(value => stateColors[value as keyof typeof stateColors] || 'rgba(156, 163, 175, 0.8)');
      borderColors = realStates.map(value => stateBorderColors[value as keyof typeof stateBorderColors] || 'rgb(156, 163, 175)');
    }
    
    const dataLabel = isPumpData
      ? 'Estado de la bomba (0=Apagada, 1=Encendida, 2=Error, 3=Selector Fuera)'
      : deviceType === 'pressure'
      ? pressureUnit === 'L/s' ? 'Caudal (L/s)' : `Presión (${pressureUnit})`
      : 'Nivel del tanque (%)';

    setChartData({
      labels: sortedLabels,
      datasets: [
        {
          label: dataLabel,
          data: displayValues,
          realStates: realStates,
          borderColor: isPumpData ? borderColors : 'rgb(53, 162, 235)',
          backgroundColor: isPumpData ? backgroundColors : 'rgba(53, 162, 235, 0.5)',
          fill: !isPumpData,
          pointRadius: isPumpData ? 4 : 0,
          pointHoverRadius: isMobile ? 6 : 8,
          pointHoverBackgroundColor: isPumpData ? 'rgb(34, 197, 94)' : 'rgb(53, 162, 235)',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: isMobile ? 1 : 2,
          tension: isPumpData ? 0 : 0.3,
          borderWidth: isPumpData ? 2 : 3,
          stepped: isPumpData ? false : false,
          borderRadius: isPumpData ? 4 : 0,
          borderSkipped: false
        }
      ]
    });
  };

  // Procesar datos de múltiples días
  const processMultiDayData = (
    results: Array<{ date: string; data: any }>,
    deviceKey: string,
    totalDays: number,
    failedCount: number
  ) => {
    try {
      // Determinar qué campo buscar
      let valueField = 'VALOR';
      if (dataMode === 'pumps') {
        valueField = 'ESTADO';
      } else if (deviceType === 'pressure') {
        valueField = 'PRESION_BAR';
      }

      // Recopilar todos los puntos de datos
      const allDataPoints: MultiDayDataPoint[] = [];

      results.forEach(({ date, data }) => {
        if (!data) return;

        const processItem = (item: any) => {
          if (!item || !item.DATA) return;

          let fieldValue;
          if (deviceType === 'pressure') {
            fieldValue = item.DATA.PRESION_BAR ?? item.DATA.PRESION ?? item.DATA.VALOR ?? item.DATA.CAUDAL_LPS;
          } else {
            fieldValue = item.DATA[valueField];
          }

          if (fieldValue !== undefined && item.DATA.TIME) {
            allDataPoints.push({
              timestamp: Number(item.DATA.TIME),
              value: Number(fieldValue),
              date: date
            });
          }
        };

        if (Array.isArray(data)) {
          data.forEach(processItem);
        } else if (typeof data === 'object') {
          Object.values(data).forEach(processItem);
        }
      });

      if (allDataPoints.length === 0) {
        setError('No se encontraron datos válidos en el rango seleccionado');
        setChartData(null);
        return;
      }

      // Ordenar por timestamp
      allDataPoints.sort((a, b) => a.timestamp - b.timestamp);

      // Determinar agregación
      const aggregationMethod = determineAggregation(totalDays);
      const isPumpData = dataMode === 'pumps';

      let processedData = allDataPoints;

      // Aplicar agregación si es necesario
      if (aggregationMethod === 'hourly') {
        processedData = aggregateByHour(allDataPoints, isPumpData);
        setAggregationInfo(`⚠ Datos promediados por hora para mejor visualización (${processedData.length} puntos de ${allDataPoints.length})`);
      } else if (aggregationMethod === '2-hour') {
        processedData = aggregateBy2Hours(allDataPoints, isPumpData);
        setAggregationInfo(`⚠ Datos promediados cada 2 horas para mejor visualización (${processedData.length} puntos de ${allDataPoints.length})`);
      } else {
        if (failedCount > 0) {
          setAggregationInfo(`✓ Se cargaron ${results.length} de ${totalDays} días. ${failedCount} días sin datos.`);
        } else {
          setAggregationInfo(`✓ Se cargaron ${allDataPoints.length} puntos de datos de ${totalDays} días`);
        }
      }

      // Generar labels y values
      const chartLabels = processedData.map((point, index) => {
        const date = parseLabviewTime(point.timestamp);
        return formatDateTimeForChart(date);
      });

      const chartValues = processedData.map(point => point.value);

      const realStates = isPumpData ? [...chartValues] : [];
      const displayValues = isPumpData ? chartValues.map(() => 1) : chartValues;

      let backgroundColors, borderColors;

      if (isPumpData) {
        const stateColors = {
          0: 'rgba(59, 130, 246, 0.8)',
          1: 'rgba(34, 197, 94, 0.8)',
          2: 'rgba(239, 68, 68, 0.8)',
          3: 'rgba(156, 163, 175, 0.8)'
        };
        const stateBorderColors = {
          0: 'rgb(59, 130, 246)',
          1: 'rgb(34, 197, 94)',
          2: 'rgb(239, 68, 68)',
          3: 'rgb(156, 163, 175)'
        };

        backgroundColors = realStates.map(value => stateColors[value as keyof typeof stateColors] || 'rgba(156, 163, 175, 0.8)');
        borderColors = realStates.map(value => stateBorderColors[value as keyof typeof stateBorderColors] || 'rgb(156, 163, 175)');
      }

      const dataLabel = isPumpData
        ? 'Estado de la bomba (0=Apagada, 1=Encendida, 2=Error, 3=Selector Fuera)'
        : deviceType === 'pressure'
        ? pressureUnit === 'L/s' ? 'Caudal (L/s)' : `Presión (${pressureUnit})`
        : 'Nivel del tanque (%)';

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: dataLabel,
            data: displayValues,
            realStates: realStates,
            borderColor: isPumpData ? borderColors : 'rgb(53, 162, 235)',
            backgroundColor: isPumpData ? backgroundColors : 'rgba(53, 162, 235, 0.5)',
            fill: !isPumpData,
            pointRadius: isPumpData ? 4 : 0,
            pointHoverRadius: isMobile ? 6 : 8,
            pointHoverBackgroundColor: isPumpData ? 'rgb(34, 197, 94)' : 'rgb(53, 162, 235)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: isMobile ? 1 : 2,
            tension: isPumpData ? 0 : 0.3,
            borderWidth: isPumpData ? 2 : 3,
            stepped: isPumpData ? false : false,
            borderRadius: isPumpData ? 4 : 0,
            borderSkipped: false
          }
        ]
      });
    } catch (error: any) {
      console.error('Error al procesar datos multi-día:', error);
      setError(`Error al procesar datos: ${error.message || 'Error desconocido'}`);
      setChartData(null);
    }
  };

  // Cargar datos cuando cambie el rango de fechas
  useEffect(() => {
    if (dateRange.mode === 'single') {
      loadDataForDate(dateRange.start);
    } else {
      fetchDateRangeData(dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  const { year, month, day } = parseSelectedDateInCostaRica(dateRange.start);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            weight: 'bold' as const,
            size: isMobile ? 10 : 12
          },
          boxWidth: isMobile ? 10 : 40
        }
      },
      title: {
        display: true,
        text: `Histórico de ${dataMode === 'pumps' ? 'Estado de Bombas' : deviceType === 'pressure' ? (pressureUnit === 'L/s' ? 'Caudal' : 'Presión') : 'Niveles'} - ${day}/${month}/${year} (Costa Rica)`,
        color: 'white',
        font: {
          size: isMobile ? 14 : 16,
          weight: 'bold' as const
        },
        padding: isMobile ? {top: 5, bottom: 5} : {top: 10, bottom: 10}
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            if (isMobile) {
              const label = items[0].label;
              const match = label.match(/\(([^)]+)\)/); 
              return match ? match[1] : label;
            }
            return items[0].label;
          },
          label: (context) => {
            if (dataMode === 'pumps') {
              const realState = context.dataset.realStates?.[context.dataIndex];
              const estados = ['Apagada', 'Encendida', 'Error', 'Selector Fuera'];
              return `Estado: ${estados[realState] || 'Desconocido'}`;
            }
            // Para niveles o presión/caudal
            return deviceType === 'pressure'
              ? pressureUnit === 'L/s' ? `Caudal: ${context.raw} L/s` : `Presión: ${context.raw} ${pressureUnit}`
              : `Nivel: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: dataMode === 'pumps' ? 1.2 : (deviceType === 'pressure' && pressureUnit === 'L/s' ? 100 : 105), 
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          display: !isMobile && dataMode === 'levels' 
        },
        ticks: {
          color: 'white',
          font: {
            weight: 'bold' as const,
            size: isMobile ? 9 : 11
          },
          callback: function(value) {
            if (dataMode === 'pumps') {
              return '';
            }
            return deviceType === 'pressure'
              ? (pressureUnit === 'L/s' ? value + ' L/s' : value + ' ' + pressureUnit)
              : value + '%';
          },
          maxTicksLimit: isMobile ? 6 : (dataMode === 'pumps' ? 0 : 11),
          stepSize: dataMode === 'pumps' ? 1 : undefined,
          display: dataMode === 'levels'
        },
        title: {
          display: !isMobile && dataMode === 'levels',
          text: deviceType === 'pressure'
            ? (pressureUnit === 'L/s' ? 'Caudal (L/s)' : `Presión (${pressureUnit})`)
            : 'Nivel del Tanque (%)',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          display: !isMobile
        },
        ticks: {
          color: 'white',
          maxRotation: isMobile ? 90 : 45,
          minRotation: isMobile ? 90 : 45,
          font: {
            weight: 'bold' as const,
            size: isMobile ? 8 : 10
          },
          autoSkip: true,
          maxTicksLimit: isMobile ? 8 : 15
        },
        title: {
          display: !isMobile,
          text: dateRange.mode === 'range' ? 'Fecha y hora' : 'Hora del día',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      }
    },
    ...(dataMode === 'pumps' && {
      categoryPercentage: 0.8, 
      barPercentage: 0.9, 
      elements: {
        bar: {
          borderRadius: 4
        }
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Card className="w-[95%] max-w-4xl max-h-[95vh] bg-gray-900 border-gray-800 overflow-hidden">
        <CardHeader className="bg-gray-800 flex flex-row items-center justify-between gap-2 pb-2 px-3 sm:px-6">
          <div className="flex items-center min-w-0 flex-1">
            <Calendar className="text-blue-400 mr-2" size={isMobile ? 16 : 18} />
            <h2 className={`${isMobile ? 'text-base' : 'text-xl'} font-semibold text-gray-100 truncate min-w-0`}>
              Histórico {deviceName}{groupName ? ` ${groupName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : ''}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 shrink-0"
            aria-label="Cerrar modal de histórico"
          >
            <X className="text-gray-400 hover:text-white" size={isMobile ? 18 : 20} />
          </button>
        </CardHeader>
        
        <CardContent className="p-2 sm:p-4 overflow-auto">
          {/* Botones de preset */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm text-gray-400 mb-2">Seleccionar Rango</label>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setDateRange({
                  start: addDays(formatDateForInput(getCostaRicaDate()), -7),
                  end: formatDateForInput(getCostaRicaDate()),
                  mode: 'range'
                })}
                className="px-3 py-1.5 text-xs sm:text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition"
              >
                Últimos 7 días
              </button>
              <button
                onClick={() => setDateRange({
                  start: addDays(formatDateForInput(getCostaRicaDate()), -30),
                  end: formatDateForInput(getCostaRicaDate()),
                  mode: 'range'
                })}
                className="px-3 py-1.5 text-xs sm:text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition"
              >
                Últimos 30 días
              </button>
              <button
                onClick={() => setDateRange({
                  start: getFirstDayOfMonth(),
                  end: formatDateForInput(getCostaRicaDate()),
                  mode: 'range'
                })}
                className="px-3 py-1.5 text-xs sm:text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition"
              >
                Este mes
              </button>
              <button
                onClick={() => setDateRange({
                  start: formatDateForInput(getCostaRicaDate()),
                  end: formatDateForInput(getCostaRicaDate()),
                  mode: 'single'
                })}
                className="px-3 py-1.5 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition"
              >
                Día único
              </button>
            </div>

            {/* Inputs de fecha */}
            {dateRange.mode === 'range' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    max={formatDateForInput(getCostaRicaDate())}
                    className="bg-gray-800 border border-gray-700 rounded px-2 sm:px-3 py-1 sm:py-2 text-white w-full text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    max={formatDateForInput(getCostaRicaDate())}
                    className="bg-gray-800 border border-gray-700 rounded px-2 sm:px-3 py-1 sm:py-2 text-white w-full text-sm sm:text-base"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Seleccionar Fecha (Costa Rica)</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value, end: e.target.value })}
                  max={formatDateForInput(getCostaRicaDate())}
                  className="bg-gray-800 border border-gray-700 rounded px-2 sm:px-3 py-1 sm:py-2 text-white w-full max-w-xs text-sm sm:text-base"
                />
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Fecha actual en Costa Rica: {formatDateForInput(getCostaRicaDate())}
            </p>
          </div>

          {/* Loading progress */}
          {loadingProgress && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
              <p className="text-xs sm:text-sm text-green-300">
                Cargando datos históricos... {loadingProgress.current} de {loadingProgress.total} días
              </p>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Aggregation info */}
          {aggregationInfo && !loading && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-300">{aggregationInfo}</p>
            </div>
          )}

          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-start">
            <Info className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" size={isMobile ? 16 : 18} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300`}>
                {dataMode === 'pumps'
                  ? dateRange.mode === 'range'
                    ? `Histórico del estado de bombas (${dateRange.start} - ${dateRange.end}, Costa Rica).`
                    : `Histórico del estado de bombas del día ${day}/${month}/${year} (Costa Rica).`
                  : deviceType === 'pressure'
                  ? dateRange.mode === 'range'
                    ? `Histórico de presión (${dateRange.start} - ${dateRange.end}, Costa Rica).`
                    : `Histórico de presión del día ${day}/${month}/${year} (Costa Rica).`
                  : dateRange.mode === 'range'
                    ? `Histórico de niveles del tanque (${dateRange.start} - ${dateRange.end}, Costa Rica).`
                    : `Histórico de niveles del tanque del día ${day}/${month}/${year} (Costa Rica).`
                }
                Las lecturas se realizan cada 30 minutos (puede haber lecturas faltantes).
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300 mt-1`}>
                {dataMode === 'pumps'
                  ? 'Cada barra representa el estado de la bomba: Apagada (0), Encendida (1), Error (2), Selector Fuera (3).'
                  : deviceType === 'pressure'
                  ? 'Cada punto representa una toma de datos con su respectiva presión en PSI.'
                  : 'Cada punto representa una toma de datos con su respectivo nivel de tanque.'
                }
                La hora mostrada corresponde a la lectura del dispositivo en Costa Rica.
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-950/30 p-3 sm:p-4 rounded-lg border border-red-900 text-red-400">
              <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Error al cargar datos históricos</p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-300`}>{error}</p>
            </div>
          )}

          {chartData && !loading && chartData.labels && chartData.labels.length > 0 && (
            <div className="h-64 sm:h-80 md:h-96 w-full">
              {dataMode === 'pumps' ? (
                <Bar data={chartData} options={options} />
              ) : (
                <Line data={chartData} options={options} />
              )}
            </div>
          )}
          
          {chartData && chartData.labels && chartData.labels.length === 0 && !loading && (
            <div className="bg-yellow-950/30 p-3 sm:p-4 rounded-lg border border-yellow-900 text-yellow-400">
              <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>No hay datos para mostrar</p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-300`}>
                No se encontraron registros de {dataMode === 'pumps' ? 'estado de bombas' : deviceType === 'pressure' ? 'presión' : 'niveles'} para la fecha seleccionada.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
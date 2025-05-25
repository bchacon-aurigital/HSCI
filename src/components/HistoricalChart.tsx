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
import { formatLabviewTimeToHourMinute, formatLabviewTimeToFullDateTime } from '../utils/timeUtils';

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
}

export default function HistoricalChart({ 
  codigoAsada, 
  deviceKey, 
  historicoKey,
  deviceName,
  onClose,
  databaseKey
}: HistoricalChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  
  // Estado para controlar si se muestran niveles o estado de bombas
  const [showPumpStatus, setShowPumpStatus] = useState(false);
  
  // Usar un solo estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Extraer año, mes y día de la fecha seleccionada
  const getFormattedDateParts = () => {
    const [year, month, day] = selectedDate.split('-');
    return { year, month: parseInt(month).toString(), day: parseInt(day).toString() };
  };

  // Función para cargar datos según la fecha seleccionada
  const loadDataForDate = async (selectedDate: Date) => {
    // Usamos la fecha tal cual, sin ajustar
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // getMonth() devuelve 0-11
    const day = selectedDate.getDate() + 1;
    
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
      
      const dataType = showPumpStatus ? 'ESTADOBOMBA' : 'NIVELES';
      const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/${dataType}/${year}/${month}/${day}.json`;
      
      console.log(`Obteniendo datos para ${day}/${month}/${year} desde API`);
      const response = await fetch(url);
    
      if (!response.ok) {
        if (response.status === 404) {
          setChartData(null);
          setError(`No hay datos disponibles para ${day}/${month}/${year}`);
        } else {
          throw new Error(`Error de red: ${response.status}`);
        }
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

  const processHistoricalData = (data: any, deviceKey: string) => {
    // Procesar los datos para la gráfica
    const chartLabels: string[] = [];
    const chartValues: number[] = [];
    const chartTimeLabels: string[] = []; // Para almacenar solo las horas para móviles
    
    // Verificar si data es null o undefined
    if (!data) {
      console.error('No hay datos para procesar');
      setError('No hay datos disponibles para este dispositivo');
      setChartData(null);
      return;
    }
    
    const valueField = showPumpStatus ? 'ESTADO' : 'VALOR';
    
    // Verificar si es un objeto o un array
    if (Array.isArray(data)) {
      // Es un array
      data.forEach((item, index) => {
        // Verificar que el item no sea nulo y tenga datos
        if (item && item.DATA && item.DATA[valueField] !== undefined) {
          const timeLabel = item.DATA.TIME 
            ? formatLabviewTimeToHourMinute(Number(item.DATA.TIME)) 
            : `Registro ${index + 1}`;
          chartLabels.push(`Toma ${index + 1} (${timeLabel})`);
          chartTimeLabels.push(timeLabel); // Solo la hora para móviles
          chartValues.push(Number(item.DATA[valueField]));
        }
      });
    } else if (typeof data === 'object') {
      // Es un objeto
      try {
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          if (value && value.DATA && value.DATA[valueField] !== undefined) {
            let timeLabel;
            if (value.DATA.TIME) {
              timeLabel = formatLabviewTimeToHourMinute(Number(value.DATA.TIME));
            } else {
              timeLabel = 'N/D';
            }
            
            // Determinar el identificador de la toma
            let tomaLabel;
            if (key.startsWith('T')) {
              // Si comienza con 'T', usar la clave como está
              tomaLabel = key; 
            } else {
              // Si es otro tipo de clave (numérica), considerarla como el número de toma
              tomaLabel = `Toma ${key}`;
            }
            
            chartLabels.push(`${tomaLabel} (${timeLabel})`);
            chartTimeLabels.push(timeLabel); // Solo la hora para móviles
            chartValues.push(Number(value.DATA[valueField]));
          }
        });
      } catch (error) {
        console.error('Error al procesar datos históricos:', error);
        setError(`Error al procesar datos: ${error.message || 'Error desconocido'}`);
        setChartData(null);
        return;
      }
    }
    
    // Ordenar los datos por tiempo si es posible
    const combinedData = chartLabels.map((label, i) => ({ label, value: chartValues[i] }));
    
    // Ordenar por número de toma
    combinedData.sort((a, b) => {
      // Extraer el número de toma
      const tomaRegexA = a.label.match(/Toma (\d+)/);
      const tomaRegexB = b.label.match(/Toma (\d+)/);
      
      if (tomaRegexA && tomaRegexB) {
        return parseInt(tomaRegexA[1], 10) - parseInt(tomaRegexB[1], 10);
      }
      
      // Si no podemos extraer el número de toma, intentar con etiquetas T
      const tRegexA = a.label.match(/^T(\d+)/);
      const tRegexB = b.label.match(/^T(\d+)/);
      
      if (tRegexA && tRegexB) {
        return parseInt(tRegexA[1], 10) - parseInt(tRegexB[1], 10);
      }
      
      // Si todo falla, ordenar alfabéticamente
      return a.label.localeCompare(b.label);
    });
    
    // Actualizar los datos ordenados
    const sortedLabels = combinedData.map(d => d.label);
    const sortedValues = combinedData.map(d => d.value);
    

    const realStates = showPumpStatus ? [...sortedValues] : [];
    const displayValues = showPumpStatus ? sortedValues.map(() => 1) : sortedValues; 
    let backgroundColors, borderColors;
    if (showPumpStatus) {
      const stateColors = {
        0: 'rgba(239, 68, 68, 0.8)',   
        1: 'rgba(34, 197, 94, 0.8)',   
        2: 'rgba(251, 191, 36, 0.8)',  
        3: 'rgba(156, 163, 175, 0.8)' 
      };
      const stateBorderColors = {
        0: 'rgb(239, 68, 68)',  
        1: 'rgb(34, 197, 94)',   
        2: 'rgb(251, 191, 36)',  
        3: 'rgb(156, 163, 175)'
      };
      
      backgroundColors = realStates.map(value => stateColors[value as keyof typeof stateColors] || 'rgba(156, 163, 175, 0.8)');
      borderColors = realStates.map(value => stateBorderColors[value as keyof typeof stateBorderColors] || 'rgb(156, 163, 175)');
    }
    
    setChartData({
      labels: sortedLabels,
      datasets: [
        {
          label: showPumpStatus ? 'Estado de la bomba (0=Apagada, 1=Encendida, 2=Error, 3=Selector Fuera)' : 'Nivel del tanque (%)',
          data: displayValues, 
          realStates: realStates,
          borderColor: showPumpStatus ? borderColors : 'rgb(53, 162, 235)',
          backgroundColor: showPumpStatus ? backgroundColors : 'rgba(53, 162, 235, 0.5)',
          fill: !showPumpStatus, 
          pointRadius: showPumpStatus ? 4 : 0, 
          pointHoverRadius: isMobile ? 6 : 8,
          pointHoverBackgroundColor: showPumpStatus ? 'rgb(34, 197, 94)' : 'rgb(53, 162, 235)',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: isMobile ? 1 : 2,
          tension: showPumpStatus ? 0 : 0.3,
          borderWidth: showPumpStatus ? 2 : 3,
          stepped: showPumpStatus ? false : false, 
          borderRadius: showPumpStatus ? 4 : 0,
          borderSkipped: false
        }
      ]
    });
  };

  useEffect(() => {
    const date = new Date(selectedDate);
    loadDataForDate(date);
  }, [selectedDate, showPumpStatus]);

  const { year, month, day } = getFormattedDateParts();
  
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
            size: isMobile ? 10 : 12 // Tamaño de fuente más pequeño en móvil
          },
          boxWidth: isMobile ? 10 : 40 // Ancho de caja más pequeño en móvil
        }
      },
      title: {
        display: true,
        text: `Histórico de ${showPumpStatus ? 'Estado de Bombas' : 'Niveles'} - ${day}/${month}/${year}`,
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
            // En móvil, acortar el título para que sea más legible
            if (isMobile) {
              const label = items[0].label;
              // Si el formato es 'Toma X (HH:MM)', extraer solo la hora
              const match = label.match(/\(([^)]+)\)/); 
              return match ? match[1] : label;
            }
            return items[0].label;
          },
          label: (context) => {
            if (showPumpStatus) {
              const realState = context.dataset.realStates?.[context.dataIndex];
              const estados = ['Apagada', 'Encendida', 'Error', 'Selector Fuera'];
              return `Estado: ${estados[realState] || 'Desconocido'}`;
            }
            return `Nivel: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: showPumpStatus ? 1.2 : 105, 
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          display: !isMobile && !showPumpStatus 
        },
        ticks: {
          color: 'white',
          font: {
            weight: 'bold' as const,
            size: isMobile ? 9 : 11 // Tamaño de fuente más pequeño en móvil
          },
          callback: function(value) {
            if (showPumpStatus) {
              return ''; 
            }
            return value + '%';
          },
          maxTicksLimit: isMobile ? 6 : (showPumpStatus ? 0 : 11), 
          stepSize: showPumpStatus ? 1 : undefined, 
          display: !showPumpStatus 
        },
        title: {
          display: !isMobile && !showPumpStatus, 
          text: 'Nivel del Tanque (%)',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          display: !isMobile // Ocultar grid en móvil
        },
        ticks: {
          color: 'white',
          maxRotation: isMobile ? 90 : 45, // Rotación vertical en móvil para ahorrar espacio horizontal
          minRotation: isMobile ? 90 : 45,
          font: {
            weight: 'bold' as const,
            size: isMobile ? 8 : 10 // Tamaño de fuente más pequeño en móvil
          },
          autoSkip: true,
          maxTicksLimit: isMobile ? 8 : 15 // Limitar el número de ticks en móvil
        },
        title: {
          display: !isMobile, // Ocultar título en móvil para ahorrar espacio
          text: 'Hora del día',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      }
    },
    ...(showPumpStatus && {
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
        <CardHeader className="bg-gray-800 flex flex-row items-center justify-between pb-2 px-3 sm:px-6">
          <div className="flex items-center">
            <Calendar className="text-blue-400 mr-2" size={isMobile ? 16 : 18} />
            <h2 className={`${isMobile ? 'text-base' : 'text-xl'} font-semibold text-gray-100 truncate`}>
              Histórico {deviceName} - {day}/{month}/{year}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPumpStatus(!showPumpStatus)}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors ${
                showPumpStatus 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {showPumpStatus ? 'Estado Bombas' : 'Niveles'}
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              <X className="text-gray-400 hover:text-white" size={isMobile ? 18 : 20} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 overflow-auto">
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm text-gray-400 mb-1">Seleccionar Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-2 sm:px-3 py-1 sm:py-2 text-white w-full max-w-xs text-sm sm:text-base"
            />
          </div>

          {/* Información de ayuda */}
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-start">
            <Info className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" size={isMobile ? 16 : 18} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300`}>
                {showPumpStatus 
                  ? `Histórico del estado de bombas del día ${day}/${month}/${year}.`
                  : `Histórico del día ${day}/${month}/${year}.`
                }
                Las lecturas se realizan cada 30 minutos (puede haber lecturas faltantes).
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300 mt-1`}>
                {showPumpStatus
                  ? 'Cada punto representa el estado de la bomba: Apagada (0), Encendida (1), Error (2), Selector Fuera (3).'
                  : 'Cada punto representa una toma de datos con su respectivo nivel de tanque.'
                }
                La hora mostrada corresponde a la lectura del dispositivo.
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
              {showPumpStatus ? (
                <Bar data={chartData} options={options} />
              ) : (
                <Line data={chartData} options={options} />
              )}
            </div>
          )}
          
          {chartData && chartData.labels && chartData.labels.length === 0 && !loading && (
            <div className="bg-yellow-950/30 p-3 sm:p-4 rounded-lg border border-yellow-900 text-yellow-400">
              <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>No hay datos para mostrar</p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-300`}>No se encontraron registros para la fecha seleccionada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
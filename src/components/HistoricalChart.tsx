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
import { Calendar, X, Info, Activity, Droplets } from 'lucide-react';
import { formatLabviewTimeToHourMinute, formatLabviewTimeToFullDateTime } from '../utils/timeUtils';
import { TabSelector } from './ui/TabSelector';
import { checkPumpDataAvailability } from '../utils/checkPumpDataAvailability';

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
  databaseKey
}: HistoricalChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState<'levels' | 'pumps'>('levels');
  
  // Estado para saber si hay datos de bombas disponibles
  const [hasPumpData, setHasPumpData] = useState(false);
  const [checkingPumpData, setCheckingPumpData] = useState(true);
  
  // Usar fecha de Costa Rica como fecha por defecto
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateForInput(getCostaRicaDate())
  );

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

  // Verificar disponibilidad de datos de bombas al montar el componente
  useEffect(() => {
    if (databaseKey && historicoKey) {
      setCheckingPumpData(true);
      checkPumpDataAvailability(databaseKey, historicoKey)
        .then(hasData => {
          setHasPumpData(hasData);
          setCheckingPumpData(false);
          console.log(`Datos de bombas disponibles para ${deviceName}: ${hasData}`);
        })
        .catch(error => {
          console.error('Error al verificar datos de bombas:', error);
          setHasPumpData(false);
          setCheckingPumpData(false);
        });
    } else {
      setHasPumpData(false);
      setCheckingPumpData(false);
    }
  }, [databaseKey, historicoKey, deviceName]);

  // Configurar las pestañas
  const tabs = [
    {
      id: 'levels',
      label: 'Niveles',
      icon: <Droplets className="w-4 h-4" />,
      disabled: false
    },
    {
      id: 'pumps',
      label: 'Estado de Bombas',
      icon: <Activity className="w-4 h-4" />,
      disabled: !hasPumpData || checkingPumpData,
      tooltip: checkingPumpData 
        ? 'Verificando disponibilidad...' 
        : !hasPumpData 
        ? 'No hay datos de bombas disponibles para este tanque' 
        : undefined
    }
  ];

  // Manejar cambio de pestaña
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'levels' | 'pumps');
  };

  // Función para convertir fecha seleccionada a fecha en Costa Rica
  const parseSelectedDateInCostaRica = (dateString: string) => {
    // Crear fecha en Costa Rica (UTC-6)
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Crear fecha usando UTC y luego ajustar a Costa Rica
    const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)); // Usar mediodía UTC para evitar problemas de zona horaria
    
    // Ajustar a Costa Rica (UTC-6)
    const costaRicaOffset = -6 * 60; // -6 horas en minutos
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
      
      // Usar activeTab en lugar de showPumpStatus
      const dataType = activeTab === 'pumps' ? 'ESTADOBOMBA' : 'NIVELES';
      const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${databaseKey}/HISTORICO/${historicoKey}/${dataType}/${year}/${month}/${day}.json`;
      
      console.log(`Obteniendo datos de ${dataType} para ${day}/${month}/${year} (Costa Rica) desde API`);
      const response = await fetch(url);
    
      if (!response.ok) {
        if (response.status === 404) {
          setChartData(null);
          setError(`No hay datos de ${activeTab === 'pumps' ? 'estado de bombas' : 'niveles'} disponibles para ${day}/${month}/${year}`);
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
      setError(`No hay datos de ${activeTab === 'pumps' ? 'estado de bombas' : 'niveles'} disponibles para esta fecha`);
      setChartData(null);
      return;
    }
    
    const valueField = activeTab === 'pumps' ? 'ESTADO' : 'VALOR';
    
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
    
    const isPumpData = activeTab === 'pumps';
    const realStates = isPumpData ? [...sortedValues] : [];
    const displayValues = isPumpData ? sortedValues.map(() => 1) : sortedValues; 
    let backgroundColors, borderColors;
    
    if (isPumpData) {
      const stateColors = {
        0: 'rgba(59, 130, 246, 0.8)',   // Azul para bomba apagada
        1: 'rgba(34, 197, 94, 0.8)',   // Verde para bomba encendida
        2: 'rgba(239, 68, 68, 0.8)',   // Rojo para error
        3: 'rgba(156, 163, 175, 0.8)'  // Gris para selector fuera
      };
      const stateBorderColors = {
        0: 'rgb(59, 130, 246)',  // Azul para bomba apagada
        1: 'rgb(34, 197, 94)',   // Verde para bomba encendida
        2: 'rgb(239, 68, 68)',   // Rojo para error
        3: 'rgb(156, 163, 175)'  // Gris para selector fuera
      };
      
      backgroundColors = realStates.map(value => stateColors[value as keyof typeof stateColors] || 'rgba(156, 163, 175, 0.8)');
      borderColors = realStates.map(value => stateBorderColors[value as keyof typeof stateBorderColors] || 'rgb(156, 163, 175)');
    }
    
    setChartData({
      labels: sortedLabels,
      datasets: [
        {
          label: isPumpData ? 'Estado de la bomba (0=Apagada, 1=Encendida, 2=Error, 3=Selector Fuera)' : 'Nivel del tanque (%)',
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

  // Cargar datos cuando cambie la fecha o la pestaña activa
  useEffect(() => {
    loadDataForDate(selectedDate);
  }, [selectedDate, activeTab]);

  const { year, month, day } = parseSelectedDateInCostaRica(selectedDate);

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
        text: `Histórico de ${activeTab === 'pumps' ? 'Estado de Bombas' : 'Niveles'} - ${day}/${month}/${year} (Costa Rica)`,
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
            if (activeTab === 'pumps') {
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
        max: activeTab === 'pumps' ? 1.2 : 105, 
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          display: !isMobile && activeTab === 'levels' 
        },
        ticks: {
          color: 'white',
          font: {
            weight: 'bold' as const,
            size: isMobile ? 9 : 11
          },
          callback: function(value) {
            if (activeTab === 'pumps') {
              return ''; 
            }
            return value + '%';
          },
          maxTicksLimit: isMobile ? 6 : (activeTab === 'pumps' ? 0 : 11), 
          stepSize: activeTab === 'pumps' ? 1 : undefined, 
          display: activeTab === 'levels' 
        },
        title: {
          display: !isMobile && activeTab === 'levels', 
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
          text: 'Hora del día',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      }
    },
    ...(activeTab === 'pumps' && {
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
              Histórico {deviceName}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700"
          >
            <X className="text-gray-400 hover:text-white" size={isMobile ? 18 : 20} />
          </button>
        </CardHeader>
        
        <CardContent className="p-2 sm:p-4 overflow-auto">
          {/* Selector de pestañas */}
          <div className="mb-4">
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              className="mb-4"
            />
          </div>

          {/* Selector de fecha */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm text-gray-400 mb-1">Seleccionar Fecha (Costa Rica)</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={formatDateForInput(getCostaRicaDate())} // No permitir fechas futuras
              className="bg-gray-800 border border-gray-700 rounded px-2 sm:px-3 py-1 sm:py-2 text-white w-full max-w-xs text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              Fecha actual en Costa Rica: {formatDateForInput(getCostaRicaDate())}
            </p>
          </div>

          {/* Información de ayuda */}
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-start">
            <Info className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" size={isMobile ? 16 : 18} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300`}>
                {activeTab === 'pumps' 
                  ? `Histórico del estado de bombas del día ${day}/${month}/${year} (Costa Rica).`
                  : `Histórico de niveles del tanque del día ${day}/${month}/${year} (Costa Rica).`
                }
                Las lecturas se realizan cada 30 minutos (puede haber lecturas faltantes).
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300 mt-1`}>
                {activeTab === 'pumps'
                  ? 'Cada barra representa el estado de la bomba: Apagada (0), Encendida (1), Error (2), Selector Fuera (3).'
                  : 'Cada punto representa una toma de datos con su respectivo nivel de tanque.'
                }
                La hora mostrada corresponde a la lectura del dispositivo en Costa Rica.
              </p>
            </div>
          </div>

          {/* Estados de carga, error y gráfico */}
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
              {activeTab === 'pumps' ? (
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
                No se encontraron registros de {activeTab === 'pumps' ? 'estado de bombas' : 'niveles'} para la fecha seleccionada.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
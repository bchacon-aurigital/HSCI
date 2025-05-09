'use client';
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar, X, Info } from 'lucide-react';
import { formatLabviewTimeToHourMinute, formatLabviewTimeToFullDateTime } from '../utils/timeUtils';

// Registrar los componentes de chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface HistoricalChartProps {
  codigoAsada: string;
  deviceKey: string;
  deviceName: string;
  onClose: () => void;
}

export default function HistoricalChart({ 
  codigoAsada, 
  deviceKey, 
  deviceName,
  onClose 
}: HistoricalChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  
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
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // getMonth() devuelve 0-11
    const day = selectedDate.getDate();
    
    setLoading(true);
    setError(null);
    
    try {
      // Usamos una URL fija para ASROA como indicado
      const url = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASROA/HISTORICO/BP/NIVELES/${year}/${month}/${day}.json`;
      
      // Uso de sessionStorage para cachear peticiones a la misma fecha
      const cacheKey = `historical_${year}_${month}_${day}_${deviceKey}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        console.log(`Usando datos en caché para ${day}/${month}/${year}`);
        const parsedData = JSON.parse(cachedData);
        processHistoricalData(parsedData, deviceKey);
      } else {
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
        
        // Guardar en caché
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        
        // Procesar datos para el dispositivo seleccionado
        processHistoricalData(data, deviceKey);
      }
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
    
    // Verificar si es un objeto o un array
    if (Array.isArray(data)) {
      // Es un array
      data.forEach((item, index) => {
        // Verificar que el item no sea nulo y tenga datos
        if (item && item.DATA && item.DATA.VALOR) {
          const timeLabel = item.DATA.TIME 
            ? formatLabviewTimeToHourMinute(Number(item.DATA.TIME)) 
            : `Registro ${index + 1}`;
          chartLabels.push(`Toma ${index + 1} (${timeLabel})`);
          chartValues.push(Number(item.DATA.VALOR));
        }
      });
    } else {
      // Es un objeto
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (value && value.DATA && value.DATA.VALOR) {
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
          chartValues.push(Number(value.DATA.VALOR));
        }
      });
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
    
    setChartData({
      labels: sortedLabels,
      datasets: [
        {
          label: 'Nivel del tanque (%)',
          data: sortedValues,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          pointRadius: 5,
          pointBackgroundColor: 'rgb(53, 162, 235)',
          pointBorderColor: 'white',
          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: 'rgb(53, 162, 235)',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2,
          tension: 0.3
        }
      ]
    });
  };

  useEffect(() => {
    const date = new Date(selectedDate);
    loadDataForDate(date);
  }, [selectedDate]);

  const { year, month, day } = getFormattedDateParts();
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      },
      title: {
        display: true,
        text: `Histórico de Niveles - ${day}/${month}/${year}`,
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            return items[0].label;
          },
          label: (context) => {
            return `Nivel: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 105,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'white',
          font: {
            weight: 'bold' as const
          },
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Nivel del Tanque (%)',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 45,
          font: {
            weight: 'bold' as const
          }
        },
        title: {
          display: true,
          text: 'Hora del día',
          color: 'white',
          font: {
            weight: 'bold' as const
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Card className="w-[90%] max-w-4xl max-h-[90vh] bg-gray-900 border-gray-800 overflow-hidden">
        <CardHeader className="bg-gray-800 flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <Calendar className="text-blue-400 mr-2" size={18} />
            <h2 className="text-xl font-semibold text-gray-100">
              Histórico de ASADA - {day}/{month}/{year}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700"
          >
            <X className="text-gray-400 hover:text-white" size={20} />
          </button>
        </CardHeader>
        <CardContent className="p-4 overflow-auto">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Seleccionar Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white w-full max-w-xs"
            />
          </div>

          {/* Información de ayuda */}
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-start">
            <Info className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-blue-300">
                Histórico del día {day}/{month}/{year}.
                Las lecturas se realizan cada 30 minutos (puede haber lecturas faltantes).
              </p>
              <p className="text-sm text-blue-300 mt-1">
                Cada punto representa una toma de datos con su respectivo nivel de tanque.
                La hora mostrada corresponde a la lectura del dispositivo.
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-950/30 p-4 rounded-lg border border-red-900 text-red-400">
              <p className="font-medium">Error al cargar datos históricos</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {chartData && !loading && chartData.labels && chartData.labels.length > 0 && (
            <div className="h-96 w-full">
              <Line data={chartData} options={options} />
            </div>
          )}
          
          {chartData && chartData.labels && chartData.labels.length === 0 && !loading && (
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-900 text-yellow-400">
              <p className="font-medium">No hay datos para mostrar</p>
              <p className="text-sm text-yellow-300">No se encontraron registros para la fecha seleccionada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
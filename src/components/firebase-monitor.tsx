// src/components/firebase-monitor.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Droplet, AlertTriangle, RefreshCw } from 'lucide-react';

interface FirebaseData {
  fecha: string;
  valor?: number;
  [key: string]: any; // Para aceptar propiedades adicionales
}

const WaterTankIndicator = ({ percentage }: { percentage: number }) => {
  // Determine color based on percentage
  const getFillColor = (level: number) => {
    if (level > 50) return '#22c55e'; // green-500
    if (level > 25) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  // Calculate the height and y-position for the water level
  const maxHeight = 140; // Total fillable height
  const fillHeight = (percentage / 100) * maxHeight;
  const yPosition = 150 - fillHeight; // Start from bottom (150) minus the fill height

  return (
    <svg
      viewBox="0 0 100 160"
      className="w-32 h-48 mx-auto"
      style={{ minWidth: '170px' }}
    >
      {/* Tank outline */}
      <path
        d="M10,10 h80 v140 h-80 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Water level */}
      <rect
        x="10"
        y={yPosition}
        width="80"
        height={fillHeight}
        fill={getFillColor(percentage)}
        opacity="0.8"
      >
        <animate
          attributeName="height"
          from="0"
          to={fillHeight}
          dur="1s"
          fill="freeze"
        />
        <animate
          attributeName="y"
          from="150"
          to={yPosition}
          dur="1s"
          fill="freeze"
        />
      </rect>

      {/* Percentage text */}
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        className="drop-shadow-md"
      >
        {`${percentage}%`}
      </text>

      {/* Level marks and percentage markers - Moved to left side */}
      <line x1="5" y1="40" x2="15" y2="40" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="44" fill="currentColor" fontSize="10" textAnchor="end">75%</text>
      
      <line x1="5" y1="80" x2="15" y2="80" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="84" fill="currentColor" fontSize="10" textAnchor="end">50%</text>
      
      <line x1="5" y1="120" x2="15" y2="120" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="124" fill="currentColor" fontSize="10" textAnchor="end">25%</text>
    </svg>
  );
};

interface FirebaseMonitorProps {
  url?: string;
  deviceKey?: string;
  name: string;
  type?: 'tank' | 'pump' | 'valve' | 'well';
  codigoAsada?: string;
  pumpKey?: string;
}

export default function FirebaseMonitor({
  url = 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json',
  deviceKey,
  name = 'Tanque 3 Bahías',
  type = 'tank',
  codigoAsada,
  pumpKey
}: FirebaseMonitorProps) {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [retryTimer, setRetryTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    
    // Construir la URL completa si se proporciona una clave de dispositivo
    let finalUrl = url;
    if (deviceKey && codigoAsada) {
      finalUrl = `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/${codigoAsada}/${deviceKey}.json`;
    }
    
    try {
      // Crear un controller para abortar la petición si tarda demasiado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
      
      const response = await fetch(finalUrl, { 
        signal: controller.signal,
        cache: 'no-store' // Evitar caché
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result) {
        throw new Error('No se recibieron datos de Firebase');
      }
      
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
      setRetryCount(0); // Restablecer contador de reintentos al tener éxito
      
      // Programar la próxima actualización normal (5 minutos)
      if (retryTimer) clearTimeout(retryTimer);
      const interval = setTimeout(fetchData, 5 * 60 * 1000);
      setRetryTimer(interval);
      
    } catch (err) {
      // Manejo de diferentes tipos de errores
      let errorMessage = 'Error desconocido';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'La conexión tomó demasiado tiempo y se canceló';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'No se pudo conectar al servidor. Verifique su conexión a Internet';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      console.error(`Error al obtener datos de ${finalUrl}:`, errorMessage);
      setError(errorMessage);
      
      // Incrementar contador de reintentos y programar reintento con backoff exponencial
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);
      
      // Backoff exponencial: 2^n * 1000 ms (máximo 60 segundos)
      const retryDelay = Math.min(60000, Math.pow(2, nextRetryCount) * 1000);
      console.log(`Reintentando en ${retryDelay/1000} segundos...`);
      
      if (retryTimer) clearTimeout(retryTimer);
      const timer = setTimeout(fetchData, retryDelay);
      setRetryTimer(timer);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Limpieza al desmontar
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [url, deviceKey, codigoAsada]);

  const getStatusColor = (value: number) => {
    if (value > 50) return 'text-green-500';
    if (value > 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Renderizar indicador de error
  if (error && !data) {
    return (
      <Card className="max-w-md mx-auto mt-4 bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4 text-red-400">
            <AlertTriangle className="h-6 w-6" />
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full" />
                <span>Intentando...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Reintentar</span>
              </>
            )}
          </button>
        </CardContent>
      </Card>
    );
  }
  
  // Contenido principal según el tipo de dispositivo
  return (
    <Card className="max-w-md mx-auto mt-4 bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100">
          {name}
        </h2>
      </CardHeader>
      <CardContent className="p-4">
        {loading && !data ? (
          <p className="text-center py-4 text-gray-300 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Obteniendo datos en tiempo real...
          </p>
        ) : data ? (
          <div className="space-y-4">
            {/* Mostrar contenido según el tipo de dispositivo */}
            {type === 'tank' && (
              <>
                <div className="flex justify-center">
                  <WaterTankIndicator percentage={data.valor || 0} />
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Registro más reciente</p>
                      <p className="font-medium text-gray-100">{data.fecha}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Droplet className={`${getStatusColor(data.valor || 0)}`} size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Capacidad actual</p>
                      <p className={`font-medium ${getStatusColor(data.valor || 0)}`}>
                        {data.valor}% lleno
                        {(data.valor || 0) < 25 && (
                          <span className="ml-2 text-red-500 text-sm">
                            (Nivel crítico: Se requiere atención)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Para otros tipos de dispositivos, agregar aquí según necesario */}
            {type === 'pump' && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-center">
                  {/* Aquí iría un componente PumpIndicator */}
                  <div className="text-center">
                    <div className={`h-32 w-32 rounded-full flex items-center justify-center ${
                      getPumpStatus(data, pumpKey) ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'
                    } border-4`}>
                      <span className={`text-2xl font-bold ${getPumpStatus(data, pumpKey) ? 'text-green-400' : 'text-red-400'}`}>
                        {getPumpStatus(data, pumpKey) ? 'ACTIVA' : 'INACTIVA'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Actualización</p>
                      <p className="font-medium text-gray-100">{data.fecha}</p>
                    </div>
                  </div>
                  
                  {data.presion !== undefined && (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Presión</p>
                        <p className="font-medium text-gray-100">{data.presion} PSI</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Para válvulas */}
            {type === 'valve' && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className={`h-32 w-32 rounded-full flex items-center justify-center ${
                      getValveStatus(data) ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'
                    } border-4`}>
                      <span className={`text-xl font-bold ${getValveStatus(data) ? 'text-green-400' : 'text-red-400'}`}>
                        {getValveStatus(data) ? 'ABIERTA' : 'CERRADA'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Actualización</p>
                      <p className="font-medium text-gray-100">{data.fecha}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-md">
                <div className="flex items-start space-x-2 text-yellow-400">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Advertencia</p>
                    <p className="text-xs">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {lastUpdated && (
              <p className="text-sm text-gray-400 pt-2 border-t border-gray-800">
                Actualizado: {lastUpdated} <span className="text-blue-400">• Datos en tiempo real</span>
              </p>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

// Función auxiliar para obtener el estado de la bomba
function getPumpStatus(data: FirebaseData, pumpKey?: string) {
  // Si hay un pumpKey, extraer los datos específicos de la bomba
  const pumpData = pumpKey && data[pumpKey] ? data[pumpKey] : data;
  
  // Comprobar diferentes propiedades posibles
  return pumpData.estado === 1 || 
         pumpData.activo === 1 || 
         pumpData.running === true || 
         pumpData.status === 1 ||
         pumpData.status === "on";
}

// Función auxiliar para obtener el estado de la válvula
function getValveStatus(data: FirebaseData) {
  return data.estado === 1 || 
         data.abierta === 1 || 
         data.open === true || 
         data.status === 1 ||
         data.status === "open";
}
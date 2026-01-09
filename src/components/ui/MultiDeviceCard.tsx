'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, AlertTriangle, Activity, Settings, Thermometer, Droplet, Gauge, Zap, History, Ruler, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
import { ValveIndicator } from '../indicators/ValveIndicator';
import ResetButton from '../ResetButton';
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { MultiDeviceCardProps } from '../../app/types/types';
import { checkHistoricalDataAvailability } from '../../utils/historicalDataUtils';
import HistoricalChart from '../HistoricalChart';

function getFecha(data: any): string {
  return data?.fecha || data?.FECHA || 'Sin fecha disponible';
}

interface MultiDeviceCardWithAlertProps extends MultiDeviceCardProps {
  onAlertChange?: (hasAlert: boolean) => void;
  historicoKey?: string;
  databaseKey?: string;
}

// Helper para obtener la key de dispositivo de forma consistente
function getDeviceKey(device: any): string {
  return (
    device?.pumpKey ??
    device?.key ??
    device?.deviceKey ??
    device?.id ??
    (device?.type && device?.name ? `${device.type}:${device.name}` : '')
  );
}

export default function MultiDeviceCard({
  groupName,
  identifier,
  devices,
  codigoAsada,
  onAlertChange,
  historicoKey,
  databaseKey,
  historicalConfig,
}: MultiDeviceCardWithAlertProps) {
  const { data, error, loading } = useDeviceData(identifier, undefined, codigoAsada);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDevices, setExpandedDevices] = useState<Record<string, boolean>>({});
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [showHistorical, setShowHistorical] = useState(false);
  const [hasHistorical, setHasHistorical] = useState(false);

  
  const previousAlertRef = React.useRef(false);
  
  // Check if this is the BOMBA1 subgroup that should have the reset button
  const isBOMBA1Group = groupName === 'BOMBA1';

  // Handle reset completion feedback
  const handleResetComplete = (success: boolean, error?: string) => {
    if (success) {
      setResetFeedback('Equipo reiniciado correctamente');
      setTimeout(() => setResetFeedback(null), 3000);
    } else {
      setResetFeedback(`Error al reiniciar: ${error || 'Error desconocido'}`);
      setTimeout(() => setResetFeedback(null), 5000);
    }
  };

  React.useEffect(() => {
    if (!data || !onAlertChange) return;
    
    let hasAlert = false;
    devices.forEach((device) => {
      let status = undefined;
      if (device.pumpKey && data && data[device.pumpKey] !== undefined) {
        status = Number(data[device.pumpKey]);
      } else if (device.key && data && data[device.key] !== undefined) {
        status = Number(data[device.key]);
      }
      if (device.type === 'pump' || device.type === 'well') {
        if (status === 2 || status === 3) {
          hasAlert = true;
        }
      }
    });
    
    if (previousAlertRef.current !== hasAlert) {
      previousAlertRef.current = hasAlert;
      onAlertChange(hasAlert);
    }
  }, [devices, data, onAlertChange]);

  // Verificar si hay datos históricos disponibles cuando se monta el componente
  React.useEffect(() => {
    if (codigoAsada && historicoKey && databaseKey) {
      checkHistoricalDataAvailability(codigoAsada, historicoKey, databaseKey, 'multi', historicalConfig)
        .then(hasHistoricalData => {
          setHasHistorical(hasHistoricalData);
        })
        .catch(error => {
          console.error(`Error al verificar datos históricos para ${groupName}:`, error);
          setHasHistorical(false);
        });
    } else {
      setHasHistorical(false);
    }
  }, [codigoAsada, historicoKey, databaseKey, groupName, historicalConfig]);

  // Inicializar bombas y pozos expandidos por defecto (solo en primera carga)
  React.useEffect(() => {
    // Guard: solo inicializar si devices existe y expandedDevices está vacío
    if (!Array.isArray(devices)) return;
    if (Object.keys(expandedDevices).length > 0) return;

    const init: Record<string, boolean> = {};
    devices.forEach((d: any) => {
      // Expandir solo pumps y wells por defecto
      if (d?.type === 'pump' || d?.type === 'well') {
        init[getDeviceKey(d)] = true;
      }
    });

    // Solo actualizar si hay dispositivos para expandir
    if (Object.keys(init).length > 0) {
      setExpandedDevices(init);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden transition-all duration-300">
        <CardHeader className="bg-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
            <Settings className="text-gray-400 animate-pulse" size={22} />
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="animate-pulse bg-gray-800 h-5 w-32 mb-4 rounded"></div>
                  <div className="animate-pulse bg-gray-800 h-24 w-24 rounded-full"></div>
                </div>
              ))}
            </div>
            <p className="text-gray-300 mt-4 flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conectando con sistemas...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800 border-l-4 border-l-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center bg-orange-950/30 p-3 rounded-lg border border-orange-900">
            <AlertTriangle className="text-orange-500 mr-3" size={20} />
            <p className="text-orange-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = (key: string) => data && key in data && data[key] !== undefined && data[key] !== null;

  // Helper para extraer el estado de un dispositivo, manejando tanto valores primitivos como objetos
  const getDeviceStatus = (device: any) => {
    const deviceData = device.pumpKey ? data[device.pumpKey] : data[device.key || ''];

    // Si es un objeto, buscar el campo ESTADO
    if (typeof deviceData === 'object' && deviceData !== null) {
      return deviceData.ESTADO !== undefined ? deviceData.ESTADO : deviceData.valor;
    }

    // Si es un valor primitivo, devolverlo directamente
    return deviceData;
  };

  const activeDevices = devices.filter(
    (device) => hasData(device.pumpKey || device.key || '')
  );

  const activeDeviceCount = activeDevices.length;

  const onDeviceCount = activeDevices.filter(
    (device) => {
      const value = getDeviceStatus(device);
      return Number(value) === 1;
    }
  ).length;

  const valveDevices = activeDevices.filter(device => device.type === 'valve');
  const otherDevices = activeDevices.filter(device => device.type !== 'valve');

  if (!activeDeviceCount) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
        <CardHeader className="bg-gray-800 pb-2">
          <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col items-center py-8">
            <AlertTriangle className="text-gray-500 mb-3" size={32} />
            <p className="text-gray-300 font-medium">No hay dispositivos en línea</p>
            <p className="text-gray-400 text-sm mt-1">Verifique la conexión de los equipos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderSensorDetails = (deviceData?: any) => {
    if (!showDetails) return null;

    // Usar deviceData si se proporciona, de lo contrario usar data global
    const sensorData = deviceData || data;

    // Helper local para verificar si un campo existe en los datos del sensor
    const hasSensorData = (key: string) =>
      sensorData &&
      typeof sensorData === 'object' &&
      key in sensorData &&
      sensorData[key] !== undefined &&
      sensorData[key] !== null;

    return (
      <div className="mt-6 p-4 bg-gray-800/80 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Datos de sensores</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hasSensorData('AMPS') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Zap className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">CONSUMO BOMBA</p>
                <p className="font-bold text-gray-100">{sensorData.AMPS} A</p>
              </div>
            </div>
          )}

          {hasSensorData('HZ') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Activity className="text-green-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">FRECUENCIA</p>
                <p className="font-bold text-gray-100">{sensorData.HZ} Hz</p>
              </div>
            </div>
          )}

          {hasSensorData('VAC') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Zap className="text-yellow-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">VOLTAJE AC</p>
                <p className="font-bold text-gray-100">{sensorData.VAC} V</p>
              </div>
            </div>
          )}

          {hasSensorData('PRESAYA') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión Entrada</p>
                <p className="font-bold text-gray-100">{sensorData.PRESAYA} psi</p>
              </div>
            </div>
          )}
          
          {hasSensorData('PRESION') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión Bombeo</p>
                <p className="font-bold text-gray-100">{sensorData.PRESION} psi</p>
              </div>
            </div>
          )}
          
          {hasSensorData('PRESRED') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión Red</p>
                <p className="font-bold text-gray-100">{sensorData.PRESRED} psi</p>
              </div>
            </div>
          )}
          
          {hasSensorData('TEMP1') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Thermometer className="text-red-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Temperatura 1</p>
                <p className="font-bold text-gray-100">{sensorData.TEMP1}°C</p>
              </div>
            </div>
          )}
          
          {hasSensorData('TEMP2') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Thermometer className="text-red-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Temperatura 2</p>
                <p className="font-bold text-gray-100">{sensorData.TEMP2}°C</p>
              </div>
            </div>
          )}
          
          {hasSensorData('ppm') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Droplet className="text-cyan-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Cloro residual</p>
                <p className="font-bold text-gray-100">{sensorData.ppm}</p>
              </div>
            </div>
          )}

          {hasSensorData('NIVEL_MTS') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Ruler className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Nivel en Metros</p>
                <p className="font-bold text-gray-100">{sensorData.NIVEL_MTS} m</p>
              </div>
            </div>
          )}

          {hasSensorData('mtscolum') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Ruler className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Nivel en Metros</p>
                <p className="font-bold text-gray-100">{sensorData.mtscolum} m</p>
              </div>
            </div>
          )}

          {hasSensorData('ALTA') && (
            <div className={`flex items-center p-3 rounded-lg ${sensorData.ALTA === '1' || data.ALTA === 1 ? 'bg-red-900/50 border border-red-700' : 'bg-gray-700/50'}`}>
              <ShieldAlert className={sensorData.ALTA === '1' || data.ALTA === 1 ? 'text-red-400' : 'text-gray-400'} size={20} />
              <div className="ml-3">
                <p className="text-xs text-gray-400">Alarma Nivel Alto</p>
                <p className="font-bold text-gray-100">{sensorData.ALTA === '1' || data.ALTA === 1 ? 'ACTIVA' : 'Normal'}</p>
              </div>
            </div>
          )}

          {hasSensorData('BAJA') && (
            <div className={`flex items-center p-3 rounded-lg ${sensorData.BAJA === '1' || data.BAJA === 1 ? 'bg-orange-900/50 border border-orange-700' : 'bg-gray-700/50'}`}>
              <ShieldAlert className={sensorData.BAJA === '1' || data.BAJA === 1 ? 'text-orange-400' : 'text-gray-400'} size={20} />
              <div className="ml-3">
                <p className="text-xs text-gray-400">Alarma Nivel Bajo</p>
                <p className="font-bold text-gray-100">{sensorData.BAJA === '1' || data.BAJA === 1 ? 'ACTIVA' : 'Normal'}</p>
              </div>
            </div>
          )}

          {hasSensorData('DERAME') && (
            <div className={`flex items-center p-3 rounded-lg ${sensorData.DERAME === '1' || data.DERAME === 1 ? 'bg-red-900/50 border border-red-700' : 'bg-gray-700/50'}`}>
              <AlertTriangle className={sensorData.DERAME === '1' || data.DERAME === 1 ? 'text-red-400' : 'text-gray-400'} size={20} />
              <div className="ml-3">
                <p className="text-xs text-gray-400">Alarma Derrame</p>
                <p className="font-bold text-gray-100">{sensorData.DERAME === '1' || data.DERAME === 1 ? 'ACTIVA' : 'Normal'}</p>
              </div>
            </div>
          )}

          {hasSensorData('MODO') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Settings className={sensorData.MODO === '1' || data.MODO === 1 ? 'text-green-400' : 'text-blue-400'} size={20} />
              <div className="ml-3">
                <p className="text-xs text-gray-400">Modo Operación</p>
                <p className="font-bold text-gray-100">{sensorData.MODO === '1' || data.MODO === 1 ? 'Automático' : 'Manual'}</p>
              </div>
            </div>
          )}

          {hasSensorData('CALIDAD_OK') && (
            <div className={`flex items-center p-3 rounded-lg ${sensorData.CALIDAD_OK === '1' || data.CALIDAD_OK === 1 ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
              <ShieldCheck className={sensorData.CALIDAD_OK === '1' || data.CALIDAD_OK === 1 ? 'text-green-400' : 'text-red-400'} size={20} />
              <div className="ml-3">
                <p className="text-xs text-gray-400">Calidad Agua</p>
                <p className="font-bold text-gray-100">{sensorData.CALIDAD_OK === '1' || data.CALIDAD_OK === 1 ? 'OK' : 'Revisar'}</p>
              </div>
            </div>
          )}

          {hasSensorData('CAUDAL_LPS') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Droplet className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Caudal</p>
                <p className="font-bold text-gray-100">{sensorData.CAUDAL_LPS} L/s</p>
              </div>
            </div>
          )}

          {hasSensorData('VOLUMEN_M3') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Droplet className="text-cyan-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Volumen</p>
                <p className="font-bold text-gray-100">{sensorData.VOLUMEN_M3} m³</p>
              </div>
            </div>
          )}

          {hasSensorData('PRESION_BAR') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-purple-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión</p>
                <p className="font-bold text-gray-100">{sensorData.PRESION_BAR} BAR</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
    <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gray-800 pb-2">
        <div className="flex items-center justify-between">
          {!isBOMBA1Group && (
            <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
          )}
          <div className={`flex items-center gap-3 ${isBOMBA1Group ? 'w-full justify-between' : ''}`}>
            {isBOMBA1Group && (
              <ResetButton 
                onResetComplete={handleResetComplete}
                className="scale-90"
              />
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                <span className="font-medium">{onDeviceCount}</span>/{activeDeviceCount} en operación
              </span>
              <div className={`h-3 w-3 rounded-full ${onDeviceCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            </div>
          </div>
        </div>
        {resetFeedback && (
          <div className={`mt-2 p-2 rounded-md text-sm ${
            resetFeedback.includes('Error') 
              ? 'bg-red-900/30 text-red-400 border border-red-800' 
              : 'bg-green-900/30 text-green-400 border border-green-800'
          }`}>
            {resetFeedback}
          </div>
        )}
      </CardHeader>
       
      <CardContent className="pt-4">
        <div className="space-y-6">
          {valveDevices.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              <div className={`flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all duration-300 border-l-4 ${onDeviceCount > 0 ? 'border-l-green-500' : 'border-l-gray-700'}`}>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Sistema de Válvulas</h3>
                
                <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 w-full">
                  {valveDevices.map((device) => {
                    const statusAsNumber = Number(getDeviceStatus(device));
                    const isActive = statusAsNumber === 1;

                    return (
                      <div key={device.key || device.pumpKey} className="flex flex-col items-center">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">{device.name}</h4>
                        <div className="transform scale-75 md:scale-90 lg:scale-100">
                          <ValveIndicator status={statusAsNumber} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {otherDevices.map((device) => {
              const deviceKey = getDeviceKey(device);
              const statusAsNumber = Number(getDeviceStatus(device));
              const isActive = statusAsNumber === 1;
              const isDeviceExpanded = expandedDevices[deviceKey] || false;
              // Obtener el objeto completo del dispositivo para renderSensorDetails
              const deviceData = device.pumpKey ? data[device.pumpKey] : data[device.key || ''];
              
              const toggleDeviceExpanded = () => {
                const newState = !expandedDevices[deviceKey];
                setExpandedDevices(prev => ({
                  ...prev,
                  [deviceKey]: newState
                }));
              };
              
              return (
                <div 
                  key={deviceKey} 
                  className={`flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all duration-300 ${
                    isActive 
                      ? 'border-l-4 border-l-green-500 shadow-lg shadow-green-900/20' 
                      : 'border-l-4 border-l-gray-700'
                  }`}
                >
                   <div 
                     className="w-full flex items-center justify-between cursor-pointer" 
                     onClick={toggleDeviceExpanded}
                   >
                     <h3 className="text-lg font-medium text-gray-200">{device.name}</h3>
                     <svg 
                       xmlns="http://www.w3.org/2000/svg" 
                       className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDeviceExpanded ? 'rotate-180' : ''}`} 
                       fill="none" 
                       viewBox="0 0 24 24" 
                       stroke="currentColor"
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                    </div>
                   
                   {isDeviceExpanded && (
                     <div className="w-full mt-4 flex flex-col items-center">
                       {device.type === 'pump' && (
                         <PumpIndicator status={statusAsNumber} />
                       )}
                       {device.type === 'well' && (
                         <WellIndicator status={statusAsNumber} />
                       )}

                       <div className="flex items-center justify-center w-full mt-4 py-2 px-3 rounded-md bg-gray-900/50 border border-gray-700/30">
                         <Activity className={isActive ? 'text-green-400' : 'text-gray-500'} size={18} />
                         <span className="ml-2 text-sm font-medium text-gray-200">
                           {isActive ? 'En operación' : 'En reposo'}
                         </span>
                       </div>

                       {/* Mostrar detalles de sensores para este dispositivo específico */}
                       {renderSensorDetails(deviceData)}

                       {/* Botón de histórico individual para este dispositivo */}
                       {device.historicoKey && device.databaseKey && (
                         <button
                           onClick={() => setShowHistorical(true)}
                           className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                         >
                           <History size={18} />
                           Ver histórico
                         </button>
                       )}
                     </div>
                   )}
                  </div>
                );
            })}
          </div>
            
            {/* Botón de históricos */}
            {hasHistorical && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowHistorical(true)}
                  className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <History className="mr-2" size={18} />
                  Ver histórico
                </button>
              </div>
            )}
        </div>
        
        {renderSensorDetails()}
        
        {(hasData('PRESAYA') || hasData('AMPS') || hasData('HZ') || hasData('VAC') || hasData('PRESION') || hasData('PRESRED') ||
          hasData('TEMP1') || hasData('TEMP2') || hasData('ppm') || hasData('NIVEL_MTS') || hasData('mtscolum') || hasData('ALTA') || hasData('BAJA') ||
          hasData('DERAME') || hasData('MODO') || hasData('CALIDAD_OK') || hasData('CAUDAL_LPS') || hasData('VOLUMEN_M3') ||
          hasData('PRESION_BAR')) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <span>{showDetails ? 'Ocultar detalles' : 'Ver detalles de sensores'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </CardContent>
       
      <CardFooter className="bg-gray-800/50 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Clock className="text-blue-400" size={18} />
          <div>
            <p className="text-xs text-gray-400">Última sincronización</p>
            <p className="font-medium text-gray-100">{formatDate(getFecha(data))}</p>
          </div>
        </div>
      </CardFooter>
    </Card>

      {showHistorical ? (
        <HistoricalChart
          codigoAsada={codigoAsada}
          deviceKey={identifier}
          historicoKey={historicoKey}
          deviceName={groupName}
          databaseKey={databaseKey}
          deviceType="multi"
          historicalConfig={historicalConfig}
          onClose={() => setShowHistorical(false)}
        />
      ) : null}
    </>
  );
}
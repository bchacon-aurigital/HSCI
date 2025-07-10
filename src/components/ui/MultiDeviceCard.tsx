'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, AlertTriangle, Activity, Settings, Thermometer, Droplet, Gauge, Zap } from 'lucide-react';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
import { ValveIndicator } from '../indicators/ValveIndicator';
import ResetButton from '../ResetButton';
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { MultiDeviceCardProps } from '../../app/types/types';

function getFecha(data: any): string {
  return data?.fecha || data?.FECHA || 'Sin fecha disponible';
}

interface MultiDeviceCardWithAlertProps extends MultiDeviceCardProps {
  onAlertChange?: (hasAlert: boolean) => void;
}

export default function MultiDeviceCard({
  groupName,
  identifier,
  devices,
  codigoAsada,
  onAlertChange,
}: MultiDeviceCardWithAlertProps) {
  const { data, error, loading } = useDeviceData(identifier, undefined, codigoAsada);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDevices, setExpandedDevices] = useState<Record<string, boolean>>({});
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  
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

  const activeDevices = devices.filter(
    (device) => hasData(device.pumpKey || device.key || '')
  );
  
  const activeDeviceCount = activeDevices.length;
  
  const onDeviceCount = activeDevices.filter(
    (device) => {
      const value = device.pumpKey ? data[device.pumpKey] : data[device.key || ''];
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

  const renderSensorDetails = () => {
    if (!showDetails) return null;

    return (
      <div className="mt-6 p-4 bg-gray-800/80 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Datos de sensores</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hasData('AMPS') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Zap className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">CONSUMO BOMBA</p>
                <p className="font-bold text-gray-100">{data.AMPS} A</p>
              </div>
            </div>
          )}

          {hasData('HZ') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Activity className="text-green-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">FRECUENCIA</p>
                <p className="font-bold text-gray-100">{data.HZ} Hz</p>
              </div>
            </div>
          )}

          {hasData('VAC') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Zap className="text-yellow-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">VOLTAJE AC</p>
                <p className="font-bold text-gray-100">{data.VAC} V</p>
              </div>
            </div>
          )}

          {hasData('PRESAYA') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión Entrada</p>
                <p className="font-bold text-gray-100">{data.PRESAYA} psi</p>
              </div>
            </div>
          )}
          
          {hasData('PRESION') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión Bombeo</p>
                <p className="font-bold text-gray-100">{data.PRESION} psi</p>
              </div>
            </div>
          )}
          
          {hasData('PRESRED') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Gauge className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Presión Red</p>
                <p className="font-bold text-gray-100">{data.PRESRED} psi</p>
              </div>
            </div>
          )}
          
          {hasData('TEMP1') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Thermometer className="text-red-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Temperatura 1</p>
                <p className="font-bold text-gray-100">{data.TEMP1}°C</p>
              </div>
            </div>
          )}
          
          {hasData('TEMP2') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Thermometer className="text-red-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Temperatura 2</p>
                <p className="font-bold text-gray-100">{data.TEMP2}°C</p>
              </div>
            </div>
          )}
          
          {hasData('ppm') && (
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Droplet className="text-cyan-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">Cloro residual</p>
                <p className="font-bold text-gray-100">{data.ppm}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
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
                    const statusAsNumber = Number(device.pumpKey ? data[device.pumpKey] : data[device.key || '']);
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
              const deviceKey = device.pumpKey || device.key || '';
              const statusAsNumber = Number(device.pumpKey ? data[device.pumpKey] : data[device.key || '']);
              const isActive = statusAsNumber === 1;
              const isDeviceExpanded = expandedDevices[deviceKey] || false;
              
              const toggleDeviceExpanded = () => {
                setExpandedDevices(prev => ({
                  ...prev,
                  [deviceKey]: !prev[deviceKey]
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
                     </div>
                   )}
                  </div>
                );
            })}
          </div>
        </div>
        
        {renderSensorDetails()}
        
        {(hasData('PRESAYA') || hasData('AMPS') || hasData('HZ') || hasData('VAC') || hasData('PRESION') || hasData('PRESRED') || 
          hasData('TEMP1') || hasData('TEMP2') || hasData('ppm')) && (
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
  );
}
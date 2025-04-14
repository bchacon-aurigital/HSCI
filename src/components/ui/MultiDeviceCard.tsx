'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, AlertTriangle, Activity, Settings, Thermometer, Droplet, Gauge } from 'lucide-react';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
import { ValveIndicator } from '../indicators/ValveIndicator';
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { MultiDeviceCardProps } from '../../app/types/types';

export default function MultiDeviceCard({
  groupName,
  identifier,
  devices,
  codigoAsada, 
}: MultiDeviceCardProps) {
  const { data, error, loading } = useDeviceData(identifier, undefined, codigoAsada);
  const [showDetails, setShowDetails] = useState(false);
  
  // Función de ayuda para renderizar indicadores con manejo de errores
  const renderDeviceIndicator = (device: any, status: number) => {
    try {
      switch (device.type) {
        case 'pump':
          return <PumpIndicator status={status} />;
        case 'well':
          return <WellIndicator status={status} />;
        case 'valve':
          return <ValveIndicator status={status} />;
        default:
          return (
            <div className="text-yellow-400 p-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Tipo de dispositivo no soportado
            </div>
          );
      }
    } catch (error) {
      console.error(`Error al renderizar indicador para ${device.name}:`, error);
      return (
        <div className="text-red-400 p-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Error al renderizar indicador
        </div>
      );
    }
  };

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

  // Función para verificar si hay datos específicos en el objeto data
  const hasData = (key: string) => {
    if (!data || !key) return false;
    return key in data && data[key] !== undefined && data[key] !== null;
  };

  // Filtrar dispositivos activos de manera segura
  const activeDevices = devices.filter(device => {
    const key = device.pumpKey || device.key || '';
    return hasData(key);
  });
  
  const activeDeviceCount = activeDevices.length;
  
  // Contar dispositivos activos de manera segura
  const onDeviceCount = activeDevices.filter(device => {
    try {
      const key = device.pumpKey || device.key || '';
      if (!hasData(key)) return false;
      
      // Verificar diferentes formatos posibles de estado activo
      const value = data[key];
      if (typeof value === 'number') return value === 1;
      if (typeof value === 'boolean') return value === true;
      if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'on';
      return Number(value) === 1;
    } catch (e) {
      console.error('Error al determinar estado del dispositivo:', e);
      return false;
    }
  }).length;

  // Agrupar las válvulas de manera segura
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

  // Renderizar tarjeta de indicadores de sensores
  const renderSensorDetails = () => {
    if (!showDetails) return null;

    return (
      <div className="mt-6 p-4 bg-gray-800/80 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Datos de sensores</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              <span className="font-medium">{onDeviceCount}</span>/{activeDeviceCount} en operación
            </span>
            <div className={`h-3 w-3 rounded-full ${onDeviceCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
        </div>
      </CardHeader>
       
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Sección de válvulas (si hay más de una) */}
          {valveDevices.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              <div className={`flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all duration-300 border-l-4 ${onDeviceCount > 0 ? 'border-l-green-500' : 'border-l-gray-700'}`}>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Sistema de Válvulas</h3>
                
                <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 w-full">
                  {valveDevices.map((device) => {
                    try {
                      const key = device.pumpKey || device.key || '';
                      if (!hasData(key)) return null;
                      
                      let statusAsNumber = 0;
                      const rawValue = data[key];
                      
                      // Convertir valor a número de manera segura
                      if (typeof rawValue === 'number') {
                        statusAsNumber = rawValue;
                      } else if (typeof rawValue === 'boolean') {
                        statusAsNumber = rawValue ? 1 : 0;
                      } else if (typeof rawValue === 'string') {
                        statusAsNumber = rawValue === '1' || rawValue.toLowerCase() === 'on' || rawValue.toLowerCase() === 'true' ? 1 : 0;
                      } else {
                        statusAsNumber = Number(rawValue) || 0;
                      }
                      
                      const isActive = statusAsNumber === 1;
                      
                      return (
                        <div key={key} className="flex flex-col items-center">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">{device.name}</h4>
                          <div className="transform scale-75 md:scale-90 lg:scale-100">
                            {renderDeviceIndicator(device, statusAsNumber)}
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error(`Error al renderizar ${device.name}:`, error);
                      return (
                        <div key={device.key || device.pumpKey || Math.random().toString()} className="flex flex-col items-center">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">{device.name}</h4>
                          <div className="bg-red-900/30 p-3 rounded-md">
                            <AlertTriangle className="text-red-400" size={24} />
                            <p className="text-xs text-red-300 mt-1">Error al renderizar</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          )}
          
          {/* Otros dispositivos (no válvulas) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {otherDevices.map((device) => {
              try {
                const key = device.pumpKey || device.key || '';
                if (!hasData(key)) return null;
                
                let statusAsNumber = 0;
                const rawValue = data[key];
                
                // Convertir valor a número de manera segura
                if (typeof rawValue === 'number') {
                  statusAsNumber = rawValue;
                } else if (typeof rawValue === 'boolean') {
                  statusAsNumber = rawValue ? 1 : 0;
                } else if (typeof rawValue === 'string') {
                  statusAsNumber = rawValue === '1' || rawValue.toLowerCase() === 'on' || rawValue.toLowerCase() === 'true' ? 1 : 0;
                } else {
                  statusAsNumber = Number(rawValue) || 0;
                }
                
                const isActive = statusAsNumber === 1;
                
                return (
                  <div 
                    key={key} 
                    className={`flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all duration-300 ${
                      isActive 
                        ? 'border-l-4 border-l-green-500 shadow-lg shadow-green-900/20' 
                        : 'border-l-4 border-l-gray-700'
                    }`}
                  >
                    <h3 className="text-lg font-medium text-gray-200 mb-2">{device.name}</h3>
   
                    {renderDeviceIndicator(device, statusAsNumber)}
                     
                    <div className="flex items-center justify-center w-full mt-4 py-2 px-3 rounded-md bg-gray-900/50 border border-gray-700/30">
                      <Activity className={isActive ? 'text-green-400' : 'text-gray-500'} size={18} />
                      <span className="ml-2 text-sm font-medium text-gray-200">
                        {isActive ? 'En operación' : 'En reposo'}
                      </span>
                    </div>
                  </div>
                );
              } catch (error) {
                console.error(`Error al renderizar ${device.name}:`, error);
                return (
                  <div 
                    key={device.pumpKey || device.key || Math.random().toString()} 
                    className="flex flex-col items-center bg-gray-800 rounded-lg p-4 border-l-4 border-l-red-500"
                  >
                    <h3 className="text-lg font-medium text-gray-200 mb-2">{device.name}</h3>
                    <div className="bg-red-900/30 p-4 rounded-md w-full text-center">
                      <AlertTriangle className="text-red-400 mx-auto mb-2" size={32} />
                      <p className="text-red-300">Error al cargar dispositivo</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        
        {renderSensorDetails()}
        
        {(hasData('PRESAYA') || hasData('PRESION') || hasData('PRESRED') || 
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
            <p className="font-medium text-gray-100">
              {data && data.fecha ? formatDate(data.fecha) : 'Desconocido'}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
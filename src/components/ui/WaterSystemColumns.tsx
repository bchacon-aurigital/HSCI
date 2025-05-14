'use client';
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import Login from '../Login';
import WaterTankCard from './WaterTankCard';
import MultiDeviceCard from './MultiDeviceCard';
import { useDeviceGroups } from '../../hooks/useDeviceGroups';
import { BaseDeviceType, MultiDevice } from '../../app/types/types';
import { loadDevicesForAsada } from '../../hooks/dynamicDeviceLoader';
import { setRealTimeMode, triggerRefresh } from '../../hooks/useAggregatedData';

export default function WaterSystemColumns() {
  const [codigoAsada, setCodigoAsada] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nombreAsada, setNombreAsada] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isRealTime, setIsRealTime] = useState<boolean>(false);
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Añadir estado para controlar si la ASADA es la de control
  const [isControlAsada, setIsControlAsada] = useState<boolean>(false);
  // Estado global para alertas
  const [deviceAlerts, setDeviceAlerts] = useState<Record<string, boolean>>({});

  const handleLogin = (codigo: string) => {
    setLoading(true);
    setError(null);
    setCodigoAsada(codigo);
    setIsLoggedIn(true);

  };

  const { groupedDevices, loading: devicesLoading, reloadDevices } = useDeviceGroups(codigoAsada);

  // Función para activar/desactivar modo tiempo real
  const toggleRealTime = () => {
    const newState = !isRealTime;
    setIsRealTime(newState);
    
    // Actualizamos la variable global para que otros componentes
    // puedan verificar si el modo tiempo real está activo
    window.isRealTimeActive = newState;
    
    // Usar la función centralizada para controlar el modo tiempo real
    setRealTimeMode(newState);
    
    // Si se activa, forzar una actualización inmediata
    if (newState) {
      triggerRefresh().catch(err => {
        console.error('Error en actualización en tiempo real:', err);
      });
    }
  };

  // Limpiar intervalo al desmontar el componente
  useEffect(() => {
    // Inicializar variable global de tiempo real
    window.isRealTimeActive = isRealTime;
    
    return () => {
      // Desactivar el modo tiempo real al desmontar
      if (isRealTime) {
        window.isRealTimeActive = false;
        setRealTimeMode(false);
      }
    };
  }, [isRealTime]);

  // Desactivar tiempo real solo si cambia el código de ASADA
  useEffect(() => {
    // Solo desactivar si cambia el codigoAsada y el modo tiempo real está activo
    if (codigoAsada && isRealTime) {
      console.log("Desactivando tiempo real por cambio de ASADA");
      window.isRealTimeActive = false;
      setRealTimeMode(false);
      setIsRealTime(false);
    }
  }, [codigoAsada]); // Solo depende de codigoAsada, no de isRealTime

  useEffect(() => {
    if (codigoAsada) {
      try {
        loadDevicesForAsada(codigoAsada)
          .then(({ name }) => {
            setNombreAsada(name);
            setLoading(false);
            setError(null);
            
            // Actualizar el estado de isControlAsada basado en el código de asada
            setIsControlAsada(codigoAsada === 'codigo2');
            console.log(`ASADA Control: ${codigoAsada === 'codigo2' ? 'SÍ' : 'NO'}`);
          })
          .catch(err => {
            console.error('Error al cargar dispositivos:', err);
            setError(`Error al cargar ASADA: ${err.message || 'Error desconocido'}`);
            setLoading(false);
          });
      } catch (err: any) {
        setError(`Error al inicializar ASADA: ${err.message || 'Error desconocido'}`);
        setLoading(false);
      }
    }
  }, [codigoAsada]);

  // Inicializar columnas cerradas por defecto cuando groupedDevices cambie
  useEffect(() => {
    if (groupedDevices && groupedDevices.length > 0) {
      // Solo inicializar para grupos nuevos, preservar estado de grupos existentes
      const initialState: Record<string, boolean> = {...collapsedGroups};
      
      groupedDevices.forEach(group => {
        // Solo establecer el estado para grupos que no tengan un estado definido
        if (initialState[group.name] === undefined) {
          initialState[group.name] = true;
        }
      });
      
      // Solo actualizar si hay cambios
      if (JSON.stringify(initialState) !== JSON.stringify(collapsedGroups)) {
        setCollapsedGroups(initialState);
      }
    }
  }, [groupedDevices]);

  // Función para verificar si un grupo tiene algún dispositivo en alerta
  const hasGroupAlert = (groupName: string) => {
    // Buscar dispositivos de este grupo en el estado de alertas
    for (const deviceId in deviceAlerts) {
      // Formato: "grupo:::dispositivo"
      if (deviceId.startsWith(`${groupName}:::`) && deviceAlerts[deviceId]) {
        return true;
      }
    }
    return false;
  };

  // Función para registrar alerta de un dispositivo
  const registerAlert = (groupName: string, deviceId: string, hasAlert: boolean) => {
    const alertKey = `${groupName}:::${deviceId}`;
    setDeviceAlerts(prev => {
      // Evitar actualizaciones innecesarias que causan bucles infinitos
      // Solo actualizar el estado si el valor realmente cambió
      if (prev[alertKey] === hasAlert) {
        return prev; // Devolver el estado anterior sin cambios
      }
      // Solo si hay un cambio real, actualizar el estado
      return {
        ...prev,
        [alertKey]: hasAlert
      };
    });
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleReloadDevices = () => {
    setError(null);
    // Mostrar indicador de carga
    setLoading(true);
    
    // Forzar actualización de datos inmediatamente
    triggerRefresh()
      .then(() => {
        console.log("Datos actualizados manualmente");
        // Recargar dispositivos sin reiniciar el estado de los grupos colapsados
        return reloadDevices();
      })
      .then(() => {
        // Ocultar indicador de carga cuando todo esté listo
        setLoading(false);
      })
      .catch(err => {
        setError(`Error al recargar dispositivos: ${err.message || 'Error desconocido'}`);
        setLoading(false);
      });
  };

  // Manejo de renderizado seguro
  const renderDeviceCard = (device: any, identifier: string, groupName: string) => {
    try {
      if ('multiDevices' in device) {
        const multiDevice = device as MultiDevice;
        return (
          <MultiDeviceCard
            key={`multi-${identifier}`}
            groupName={device.name}
            identifier={identifier}
            devices={multiDevice.multiDevices}
            codigoAsada={codigoAsada}
            onAlertChange={(hasAlert) => registerAlert(groupName, identifier, hasAlert)}
          />
        );
      } else {
        return (
          <WaterTankCard
            key={`${identifier}-${device.name}-${device.pumpKey || ''}`}
            name={device.name}
            identifier={identifier}
            type={device.type as BaseDeviceType}
            pumpKey={device.pumpKey}
            codigoAsada={codigoAsada}
            historicoKey={device.historicoKey}
            onAlertChange={(hasAlert) => registerAlert(groupName, identifier, hasAlert)}
          />
        );
      }
    } catch (error) {
      console.error(`Error al renderizar dispositivo ${device.name}:`, error);
      return (
        <div key={`error-${identifier}-${Math.random()}`} className="bg-red-900/30 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-white mb-2">{device.name || 'Dispositivo'}</h3>
          <div className="flex items-center text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>Error al renderizar este dispositivo</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen rounded-2xl text-white py-4">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-[#0b1729] to-[#172236]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <p className="text-blue-300 text-xl font-medium">Conectando con los sistemas...</p>
              <p className="text-blue-200/70 mt-2">Estamos recuperando la información de sus dispositivos</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-screen">
              <div className="bg-red-900/30 p-6 rounded-lg max-w-xl w-full text-center shadow-xl">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-3">Error de conexión</h2>
                <p className="text-red-300 mb-6">{error}</p>
                <button 
                  onClick={handleReloadDevices}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center mx-auto"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Intentar nuevamente
                </button>
              </div>
            </div>
          ) : (
            <>
              <header className="mb-12">
                <div className="relative py-16 bg-[#0d1b2a] rounded-lg shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
                  <div className="relative z-10 px-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24">
                            <path
                              d="M12 2.69c-.23 0-.42.09-.59.21C9.97 4.22 4 9.08 4 15.5 4 19.58 7.42 23 12 23s8-3.42 8-7.5c0-6.42-5.97-11.28-7.41-12.6-.17-.12-.36-.21-.59-.21z"
                              fill="white"
                              stroke="white"
                            />
                          </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-blue-300">Centro de Control ASADA</h1>
                      </div>
                      <div className="flex gap-2">
                        {/* Solo mostrar el botón de tiempo real si es la ASADA de control */}
                        {isControlAsada && (
                          <button
                            onClick={toggleRealTime}
                            className={`flex items-center gap-2 px-4 py-2 ${isRealTime 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gray-600 hover:bg-gray-700'
                            } text-white rounded-lg transition-colors duration-200`}
                            disabled={devicesLoading}
                          >
                            <Clock className={`w-5 h-5 ${isRealTime ? 'text-green-200 animate-pulse' : ''}`} />
                            {isRealTime ? 'Tiempo Real Activo' : 'Activar Tiempo Real'}
                          </button>
                        )}
                        <button
                          onClick={handleReloadDevices}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                          disabled={devicesLoading}
                        >
                          <RefreshCw className={`w-5 h-5 ${devicesLoading ? 'animate-spin' : ''}`} />
                          {devicesLoading ? 'Actualizando...' : 'Actualizar Datos'}
                        </button>
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-shadow">
                      {nombreAsada}
                    </h2>
                    <p className="text-blue-200 text-lg max-w-2xl">
                      Panel centralizado de monitoreo y control • Visualización de todos los sistemas activos
                    </p>
                    {isRealTime && isControlAsada && (
                      <div className="mt-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Actualizando automáticamente cada 2 segundos
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {groupedDevices.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-800/50 rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No se encontraron dispositivos</h3>
                  <p className="text-gray-300 mb-6">No hay dispositivos configurados para esta ASADA o no se pudieron cargar.</p>
                  <button 
                    onClick={handleReloadDevices}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Recargar Dispositivos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedDevices.map((group) => (
                    <div key={group.name} className="flex flex-col h-full">
                      <div className={`bg-[#172236] border ${hasGroupAlert(group.name) ? 'border-red-500/70' : 'border-blue-500/20'} rounded-lg shadow-lg overflow-hidden mb-4`}>
                        <div className={`bg-gradient-to-r ${hasGroupAlert(group.name) ? 'from-red-900/50 to-red-800/30' : 'from-blue-900/50 to-blue-800/30'} p-4 border-b ${hasGroupAlert(group.name) ? 'border-red-500/20' : 'border-blue-500/20'}`}>
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center">
                              <div className={`h-9 w-9 rounded-full ${hasGroupAlert(group.name) ? 'bg-red-600/40' : 'bg-blue-600/40'} flex items-center justify-center mr-3 shadow-inner ${hasGroupAlert(group.name) ? 'shadow-red-500/10' : 'shadow-blue-500/10'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hasGroupAlert(group.name) ? 'text-red-300' : 'text-blue-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                              </div>
                              <span className={`bg-gradient-to-r ${hasGroupAlert(group.name) ? 'from-red-100 to-red-200' : 'from-white to-blue-100'} bg-clip-text text-transparent`}>
                                {group.name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            </h2>
                            <button 
                              onClick={() => toggleGroupCollapse(group.name)}
                              className="p-2 rounded-full hover:bg-blue-700/40 transition-all duration-200 hover:shadow-md hover:shadow-blue-900/30"
                              aria-label={collapsedGroups[group.name] ? "Expandir" : "Comprimir"}
                            >
                              {collapsedGroups[group.name] ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        {/* Renderizar hijos invisibles si la columna está cerrada para que notifiquen alerta */}
                        {collapsedGroups[group.name] && (
                          <div style={{ display: 'none' }}>
                            {[...group.devices]
                              .sort((a, b) => a.order - b.order)
                              .map((device) => {
                                try {
                                  const identifier = device.url ? device.url : device.key!;
                                  return renderDeviceCard(device, identifier, group.name);
                                } catch (error) {
                                  return null;
                                }
                              })}
                          </div>
                        )}
                        {/* Renderizado visible solo si la columna está expandida */}
                        {!collapsedGroups[group.name] && (
                          <div className="p-4 space-y-4">
                            {[...group.devices]
                              .sort((a, b) => a.order - b.order)
                              .map((device) => {
                                try {
                                  const identifier = device.url ? device.url : device.key!;
                                  return renderDeviceCard(device, identifier, group.name);
                                } catch (error) {
                                  console.error('Error al procesar dispositivo:', error);
                                  return (
                                    <div key={`error-${Math.random()}`} className="bg-red-900/30 p-4 rounded-lg shadow-md">
                                      <div className="flex items-center text-red-400">
                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                        <p>Error al procesar dispositivo</p>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <footer className="mt-16 pb-8 text-center text-sm">
                <div className="mx-auto max-w-lg border-t border-blue-500/20 pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                    <span className="text-green-300/90">Todos los sistemas conectados</span>
                  </div>
                  <p className="text-blue-300/60 mt-2">© {new Date().getFullYear()} Sistema de Monitoreo HCSI CR • Supervisión Continua 24/7</p>
                </div>
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
}
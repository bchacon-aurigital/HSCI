"use client";

import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { WaterTankIndicator } from './indicators/WaterTankIndicator';
import { PumpIndicator } from './indicators/PumpIndicator';
import { WellIndicator } from './indicators/WellIndicator';
import { ValveIndicator } from './indicators/ValveIndicator';
import { AlertTriangle, RefreshCw, Check, Database, Info, X, Wifi, Terminal } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
  details?: string;
}

const DepuradorSistemaAgua = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tipoDispositivo, setTipoDispositivo] = useState('tanque');
  // Valores separados para cada tipo de dispositivo
  const [nivelTanque, setNivelTanque] = useState(50); // 0-100 para tanques
  const [estadoBomba, setEstadoBomba] = useState(1); // 0-3 para bombas
  const [estadoPozo, setEstadoPozo] = useState(2); // 0-3 para pozos
  const [estadoValvula, setEstadoValvula] = useState(1); // 0-1 para válvulas

  const [guiaExpandida, setGuiaExpandida] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'visualizacion' | 'conectividad' | 'registros'>('visualizacion');

  useEffect(() => {
    // Registrar información inicial del sistema
    addLog('Sistema de depuración inicializado', 'info');
    addLog('Compruebe la conectividad para diagnosticar problemas de red', 'info');
  }, []);

  const toggleDebugger = () => setIsOpen(!isOpen);

  const addLog = (message: string, type: LogEntry['type'] = 'info', details?: string) => {
    const newLog: LogEntry = {
      id: nanoid(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      details
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Mantener sólo los últimos 100 logs
  };

  const clearLogs = () => setLogs([]);

  // Obtener el valor correspondiente según el tipo de dispositivo
  const obtenerValorActual = () => {
    switch (tipoDispositivo) {
      case 'tanque': return nivelTanque;
      case 'bomba': return estadoBomba;
      case 'pozo': return estadoPozo;
      case 'valvula': return estadoValvula;
      default: return 0;
    }
  };

  // Actualizar el valor correspondiente según el tipo de dispositivo
  const actualizarValor = (nuevoValor: string | number): void => {
    const valor = parseInt(nuevoValor.toString());
    if (isNaN(valor)) return;
    
    switch (tipoDispositivo) {
      case 'tanque': 
        setNivelTanque(Math.min(100, Math.max(0, valor)));
        break;
      case 'bomba': 
        setEstadoBomba(Math.min(3, Math.max(0, valor)));
        break;
      case 'pozo': 
        setEstadoPozo(Math.min(3, Math.max(0, valor)));
        break;
      case 'valvula':
        setEstadoValvula(Math.min(1, Math.max(0, valor)));
        break;
    }
  };

  // Probar conexión a Firebase
  const testConnection = async () => {
    if (!customUrl) {
      addLog('Por favor ingrese una URL', 'error');
      return;
    }

    setIsLoading(true);
    setResponseData(null);
    addLog(`Probando conexión a: ${customUrl}`, 'info');

    try {
      // Configurar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const startTime = Date.now();
      const response = await fetch(customUrl, {
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      addLog(`Conexión exitosa (${responseTime}ms)`, 'success');
      
      // Analizar la respuesta
      const dataSize = new TextEncoder().encode(JSON.stringify(data)).length;
      const dataKeys = Object.keys(data || {});
      
      addLog(`Datos recibidos: ${formatSize(dataSize)}`, 'info', 
        `Propiedades principales: ${dataKeys.slice(0, 10).join(', ')}${dataKeys.length > 10 ? '...' : ''}`);
      
      setResponseData(data);
    } catch (error) {
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (error.name === 'AbortError') {
          errorMessage = 'La conexión excedió el tiempo de espera (15 segundos)';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión. Verifique su conexión a Internet o la URL ingresada';
        }
      }
      
      addLog(`Error: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Probar todas las conexiones Firebase
  const testAllConnections = async () => {
    const firebaseUrls = [
      'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_R.json',
      'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASROA.json',
      'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/TPOJO.json',
      'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json'
    ];
    
    setIsLoading(true);
    addLog('Iniciando prueba de todas las conexiones Firebase', 'info');
    
    const results = {
      success: 0,
      failed: 0,
      totalResponseTime: 0
    };
    
    for (const url of firebaseUrls) {
      addLog(`Probando: ${url}`, 'info');
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const startTime = Date.now();
        const response = await fetch(url, {
          signal: controller.signal,
          cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        results.totalResponseTime += responseTime;
        
        if (!response.ok) {
          results.failed++;
          addLog(`Error en ${url}: HTTP ${response.status}`, 'error');
          continue;
        }
        
        const data = await response.json();
        if (data) {
          results.success++;
          addLog(`Conexión exitosa a ${url} (${responseTime}ms)`, 'success');
        } else {
          addLog(`Conexión a ${url} exitosa pero sin datos (${responseTime}ms)`, 'warning');
        }
      } catch (error) {
        results.failed++;
        let errorMessage = 'Error desconocido';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'Tiempo de espera excedido';
          } else {
            errorMessage = error.message;
          }
        }
        
        addLog(`Error en ${url}: ${errorMessage}`, 'error');
      }
    }
    
    if (firebaseUrls.length > 0) {
      const avgResponseTime = results.totalResponseTime / firebaseUrls.length;
      
      addLog(
        `Prueba de conexiones finalizada: ${results.success} exitosas, ${results.failed} fallidas, tiempo promedio: ${avgResponseTime.toFixed(0)}ms`,
        results.failed === 0 ? 'success' : results.success === 0 ? 'error' : 'warning'
      );
    } else {
      addLog('No hay URLs configuradas para probar', 'warning');
    }
    
    setIsLoading(false);
  };

  // Check network status
  const checkNetworkStatus = () => {
    const online = navigator.onLine;
    addLog(`Estado de la red: ${online ? 'En línea' : 'Sin conexión'}`, online ? 'success' : 'error');
    
    // If online, perform additional checks
    if (online) {
      const connection = (navigator as any).connection;
      
      if (connection) {
        const type = connection.effectiveType || connection.type || 'desconocido';
        const speed = connection.downlink 
          ? `${connection.downlink} Mbps` 
          : 'velocidad desconocida';
        
        addLog(`Tipo de conexión: ${type}, velocidad estimada: ${speed}`, 'info');
      }
      
      // Ping test to Firebase
      addLog('Realizando prueba de ping a Firebase...', 'info');
      
      const startTime = Date.now();
      fetch('https://firebasestorage.googleapis.com/v0/b/prueba-labview.appspot.com', { 
        method: 'HEAD',
        cache: 'no-store'
      })
        .then(() => {
          const pingTime = Date.now() - startTime;
          addLog(`Ping a Firebase: ${pingTime}ms`, pingTime < 300 ? 'success' : pingTime < 1000 ? 'warning' : 'error');
        })
        .catch(err => {
          addLog(`Error en ping a Firebase: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
        });
    }
  };

  // Formatear tamaño de datos
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Formatear JSON para mostrar
  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Error al formatear JSON';
    }
  };

  // Renderizar el componente del tipo de dispositivo seleccionado con manejo de errores
  const renderDeviceComponent = () => {
    try {
      switch (tipoDispositivo) {
        case 'tanque':
          return <WaterTankIndicator percentage={nivelTanque} />;
        case 'bomba':
          return <PumpIndicator status={estadoBomba} />;
        case 'pozo':
          return <WellIndicator status={estadoPozo} />;
        case 'valvula':
          return <ValveIndicator status={estadoValvula} />;
        default:
          return (
            <div className="p-4 bg-gray-700 rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-300">Tipo de dispositivo no reconocido</p>
            </div>
          );
      }
    } catch (error) {
      console.error(`Error al renderizar ${tipoDispositivo}:`, error);
      return (
        <div className="p-4 bg-red-900/30 rounded-lg text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300">Error al renderizar el dispositivo</p>
          <p className="text-red-400 text-xs mt-2">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      );
    }
  };

  // Renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'visualizacion':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-gray-200 block mb-2">Tipo de Dispositivo:</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-4 py-2 rounded-lg ${tipoDispositivo === 'tanque' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('tanque')}
                >
                  Tanque
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${tipoDispositivo === 'bomba' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('bomba')}
                >
                  Bomba
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${tipoDispositivo === 'pozo' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('pozo')}
                >
                  Pozo
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${tipoDispositivo === 'valvula' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('valvula')}
                >
                  Válvula
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-200 block mb-2">
                {tipoDispositivo === 'tanque' ? 'Nivel de Agua (%)' : 
                 tipoDispositivo === 'valvula' ? 'Estado (0: Cerrada, 1: Abierta)' : 
                 'Estado (0-3) [0: Reposo, 1: Activo, 2: Error, 3: Mantenimiento]'}:
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min={0} 
                  max={tipoDispositivo === 'tanque' ? 100 : tipoDispositivo === 'valvula' ? 1 : 3} 
                  step={1}
                  value={obtenerValorActual()}
                  onChange={(e) => actualizarValor(e.target.value)}
                  className="w-full"
                />
                <div className="bg-gray-700 px-3 py-1 rounded-lg min-w-[60px] text-center">
                  {obtenerValorActual()}
                </div>
              </div>

              <div className="text-white mt-2">
                {tipoDispositivo === 'valvula' && (
                  <div className={`inline-block px-2 py-1 rounded text-xs ${obtenerValorActual() === 1 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {obtenerValorActual() === 1 ? 'Abierta' : 'Cerrada'}
                  </div>
                )}
                {tipoDispositivo === 'bomba' && (
                  <div className={`inline-block px-2 py-1 rounded text-xs
                    ${obtenerValorActual() === 0 ? 'bg-blue-500/20 text-blue-300' : 
                      obtenerValorActual() === 1 ? 'bg-green-500/20 text-green-300' : 
                      obtenerValorActual() === 2 ? 'bg-red-500/20 text-red-300' : 
                      'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {obtenerValorActual() === 0 ? 'Reposo' : 
                      obtenerValorActual() === 1 ? 'Activo' : 
                      obtenerValorActual() === 2 ? 'Error' : 
                      'Mantenimiento'
                    }
                  </div>
                )}
                {tipoDispositivo === 'pozo' && (
                  <div className={`inline-block px-2 py-1 rounded text-xs
                    ${obtenerValorActual() === 0 ? 'bg-blue-500/20 text-blue-300' : 
                      obtenerValorActual() === 1 ? 'bg-green-500/20 text-green-300' : 
                      obtenerValorActual() === 2 ? 'bg-red-500/20 text-red-300' : 
                      'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {obtenerValorActual() === 0 ? 'Reposo' : 
                      obtenerValorActual() === 1 ? 'Activo' : 
                      obtenerValorActual() === 2 ? 'Error' : 
                      'Mantenimiento'
                    }
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => setGuiaExpandida(!guiaExpandida)}
                className="w-full flex items-center justify-between bg-gray-700 p-4 rounded-t text-gray-200 hover:bg-gray-600 transition-all duration-200"
              >
                <h3 className="text-lg font-medium">Guía de diagnóstico</h3>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform duration-300 ${guiaExpandida ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`bg-gray-700 p-4 rounded-b overflow-hidden transition-all duration-300 ${
                  guiaExpandida ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'
                }`}
              >
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Verificar si el componente correcto está importado</li>
                  <li>Comprobar que los tipos de props coinciden exactamente</li>
                  <li>Para MultiDeviceCard, asegurar que <code>device.type</code> esté configurado correctamente</li>
                  <li>Verificar que la estructura de datos del backend contiene las claves esperadas</li>
                  <li>Revisar la respuesta de red en la consola del navegador</li>
                  <li>Asegurar que las URLs en la configuración son correctas</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-100 mb-4">Vista Previa</h2>
              <div className="flex justify-center">
                {renderDeviceComponent()}
              </div>
            </div>
          </div>
        );
      
      case 'conectividad':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Probar Conexión</h3>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="URL de Firebase (ej: https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_R.json)"
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button
                  onClick={testConnection}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  Probar Conexión
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white mb-2">Acciones de Diagnóstico</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={testAllConnections}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
                >
                  {isLoading ? (
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Probar Todas las Conexiones
                </button>
                
                <button
                  onClick={checkNetworkStatus}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                >
                  <Wifi className="h-4 w-4 mr-1" />
                  Revisar Estado de Red
                </button>
              </div>
            </div>
            
            {responseData && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Respuesta del Servidor</h3>
                <div className="bg-gray-900 p-3 rounded-md border border-gray-700 overflow-auto max-h-60">
                  <pre className="text-green-300 text-xs">
                    {formatJSON(responseData)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'registros':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Registros del Sistema</h3>
              <button
                onClick={clearLogs}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-700 h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Terminal className="h-8 w-8 mb-2" />
                  <p>No hay registros disponibles</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-2 rounded-md ${
                        log.type === 'error' ? 'bg-red-900/30 border-l-2 border-red-500' : 
                        log.type === 'warning' ? 'bg-yellow-900/30 border-l-2 border-yellow-500' : 
                        log.type === 'success' ? 'bg-green-900/30 border-l-2 border-green-500' : 
                        'bg-gray-800 border-l-2 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start">
                        {log.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />}
                        {log.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />}
                        {log.type === 'success' && <Check className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />}
                        {log.type === 'info' && <Info className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm ${
                              log.type === 'error' ? 'text-red-300' : 
                              log.type === 'warning' ? 'text-yellow-300' : 
                              log.type === 'success' ? 'text-green-300' : 
                              'text-blue-300'
                            }`}>
                              {log.message}
                            </p>
                            <span className="text-xs text-gray-500 ml-2">{log.timestamp}</span>
                          </div>
                          
                          {log.details && (
                            <div className="mt-1 text-xs text-gray-400 bg-gray-800/50 p-1 rounded">
                              {log.details}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Botón flotante para abrir el depurador
  if (!isOpen) {
    return (
      <button
        onClick={toggleDebugger}
        className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center z-40"
        title="Abrir Depurador"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </button>
    );
  }

  // Interfaz completa del depurador
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/80 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Centro de Diagnóstico del Sistema</h2>
          <button
            onClick={toggleDebugger}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Pestañas de navegación */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('visualizacion')}
            className={`px-4 py-3 flex items-center ${activeTab === 'visualizacion' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-700/50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualización
          </button>
          <button
            onClick={() => setActiveTab('conectividad')}
            className={`px-4 py-3 flex items-center ${activeTab === 'conectividad' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-700/50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Conectividad
          </button>
          <button
            onClick={() => setActiveTab('registros')}
            className={`px-4 py-3 flex items-center ${activeTab === 'registros' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-700/50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Registros
          </button>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>
        
        {/* Pie de página */}
        <div className="border-t border-gray-700 p-3 text-xs text-gray-400 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${navigator.onLine ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Estado de red: {navigator.onLine ? 'Conectado' : 'Desconectado'}</span>
          </div>
          <div>Centro de Diagnóstico v1.2.0</div>
        </div>
      </div>
    </div>
  );
};

export default DepuradorSistemaAgua;
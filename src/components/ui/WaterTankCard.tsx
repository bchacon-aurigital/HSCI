'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {
  Clock,
  Droplet,
  AlertTriangle,
  Activity,
  Zap,
  Gauge,
  Thermometer,
  History,
} from 'lucide-react';
import { WaterTankIndicator } from '../indicators/WaterTankIndicator';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
import { CentrifugalPumpIndicator } from '../indicators/CentrifugalPumpIndicator';
import { PressureIndicator } from '../indicators/PressureIndicator';
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { BaseDeviceType, PressureRanges } from '../../app/types/types';
import { checkHistoricalDataAvailability } from '../../utils/historicalDataUtils';
import HistoricalChart from '../HistoricalChart';

interface WaterTankCardProps {
  identifier: string;
  name: string;
  type: BaseDeviceType;
  pumpKey?: string;
  codigoAsada: string;
  historicoKey?: string;
  databaseKey?: string;
  onAlertChange?: (hasAlert: boolean) => void;
  onWarningChange?: (hasWarning: boolean) => void;
  pressureRanges?: PressureRanges;
}

export default function WaterTankCard({
  identifier,
  name,
  type,
  pumpKey,
  codigoAsada,
  historicoKey,
  databaseKey,
  onAlertChange,
  onWarningChange,
  pressureRanges,
}: WaterTankCardProps) {
  const pumpKeyParam = type === 'pump' || type === 'well' ? undefined : pumpKey;
  const { data, error, loading } = useDeviceData(identifier, pumpKeyParam, codigoAsada);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeviceExpanded, setIsDeviceExpanded] = useState(false);
  const [showHistorical, setShowHistorical] = useState(false);
  const [hasHistorical, setHasHistorical] = useState(false);
  

  
  const previousAlertRef = React.useRef(false);
  const previousWarningRef = React.useRef(false);

  let tankValue;
  let hasAlert = false;
  let hasWarning = false;
  
  if (type === 'tank') {
    if (typeof data === 'number') {
      tankValue = data;
    } else if (typeof data === 'string') {
      const parsed = Number(data);
      if (!isNaN(parsed)) tankValue = parsed;
    } else if (data && typeof data === 'object') {
      if (pumpKey && pumpKey in data) {
        const pumpKeyValue = data[pumpKey];
        if (typeof pumpKeyValue === 'number') tankValue = pumpKeyValue;
        else if (pumpKeyValue !== null && pumpKeyValue !== undefined) {
          const parsedValue = Number(pumpKeyValue);
          if (!isNaN(parsedValue)) tankValue = parsedValue;
        }
      } else if ('valor' in data) {
        if (typeof data.valor === 'number') tankValue = data.valor;
        else if (data.valor !== null && data.valor !== undefined) {
          const parsedValue = Number(data.valor);
          if (!isNaN(parsedValue)) tankValue = parsedValue;
        }
      }
    }
    
    // Detectar diferentes niveles de alerta
    if (tankValue !== undefined && !isNaN(tankValue)) {
      // Alerta crítica (roja) - nivel muy bajo (<25%)
      hasAlert = tankValue < 25;
      
      // Advertencia (amarilla) - nivel bajo (entre 25% y 50%)
      hasWarning = !hasAlert && tankValue >= 25 && tankValue <= 50;
      
      if (hasAlert) {
        console.log(`ALERTA CRÍTICA en tanque ${name}: ${tankValue}%`);
      } else if (hasWarning) {
        console.log(`ADVERTENCIA en tanque ${name}: ${tankValue}%`);
      }
    }
  } else if (type === 'pump' || type === 'well') {
    const statusAsNumber = Number(
      pumpKey ? (data as any)?.[pumpKey] : (data as any)?.[identifier],
    );
    hasAlert = statusAsNumber === 2 || statusAsNumber === 3;
  }

  // Verificar si hay datos históricos disponibles cuando se monta el componente
  useEffect(() => {
    if (codigoAsada && historicoKey && databaseKey) {
      checkHistoricalDataAvailability(codigoAsada, historicoKey, databaseKey, type)
        .then(hasHistoricalData => {
          setHasHistorical(hasHistoricalData);
        })
        .catch(error => {
          console.error(`Error al verificar datos históricos para ${name}:`, error);
          setHasHistorical(false);
        });
    } else {
      setHasHistorical(false);
    }
  }, [codigoAsada, historicoKey, databaseKey, name]);

  // Notificar cambios en el estado de alerta al componente padre
  React.useEffect(() => {
    if (!onAlertChange) return;
    
    if (previousAlertRef.current !== hasAlert) {
      previousAlertRef.current = hasAlert;
      onAlertChange(hasAlert);
    }
  }, [hasAlert, onAlertChange]);
  
  // Notificar cambios en el estado de advertencia al componente padre
  React.useEffect(() => {
    if (!onWarningChange) return;
    
    if (previousWarningRef.current !== hasWarning) {
      previousWarningRef.current = hasWarning;
      onWarningChange(hasWarning);
    }
  }, [hasWarning, onWarningChange]);

  const hasData = (key: string) =>
    typeof data === 'object' &&
    data !== null &&
    key in data &&
    data[key] !== undefined &&
    data[key] !== null;

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden transition-all duration-300">
        <CardHeader className="bg-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
            <div className="animate-pulse bg-gray-700 h-6 w-6 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-pulse bg-gray-800 h-32 w-32 rounded-full" />
            <p className="text-gray-300">Sincronizando información del dispositivo…</p>
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
            <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center bg-orange-950/30 p-3 rounded-lg border border-orange-900">
            <AlertTriangle className="text-orange-500 mr-3" size={20} />
            <p className="text-orange-400">
              <span className="font-medium">No se pudieron actualizar los datos.</span>{' '}
              Reintentando conexión…
            </p>
          </div>
          <div className="mt-2 p-2 rounded bg-gray-800 text-gray-400 text-xs">
            <code>Error: {error.toString()}</code>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (type === 'tank') {
    const tankData = data;

    const hasTankValue = tankValue !== undefined && tankValue !== null && !isNaN(tankValue);
    const isLowLevel = hasTankValue && tankValue < 25;

    return (
      <>
        <Card
          className={`bg-gray-900 border-gray-800 shadow-lg transition-all duration-300 ${
            isLowLevel ? 'border-l-4 border-l-red-500' : 
            hasWarning ? 'border-l-4 border-l-yellow-500' : ''
          }`}
        >
          <CardHeader className="bg-gray-800 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
              {isLowLevel && <AlertTriangle className="text-red-500" size={24} />}
              {hasWarning && <AlertTriangle className="text-yellow-500" size={24} />}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {hasTankValue ? (
              <div className="flex flex-col items-center space-y-6">
                <WaterTankIndicator percentage={tankValue} />

                <div className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-800/80 border border-gray-700/50">
                  <Droplet
                    className={`mr-3 ${
                      tankValue < 25
                        ? 'text-red-500'
                        : tankValue <= 50
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}
                    size={24}
                  />
                  <span className="text-xl font-bold text-gray-100">{tankValue}%</span>
                  <span className="ml-2 text-gray-400">de capacidad disponible</span>
                </div>

                {/* Indicadores de estado del tanque: ALTA, BAJA, DERAME */}
                {(hasData('ALTA') || hasData('BAJA') || hasData('DERAME')) && (
                  <div className="flex items-center justify-center gap-2 w-full">
                    {hasData('ALTA') && Number(data.ALTA) === 1 && (
                      <div className="flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/50">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-300">NIVEL ALTO</span>
                      </div>
                    )}
                    {hasData('BAJA') && Number(data.BAJA) === 1 && (
                      <div className="flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50">
                        <div className="h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></div>
                        <span className="text-xs font-medium text-orange-300">NIVEL BAJO</span>
                      </div>
                    )}
                    {hasData('DERAME') && Number(data.DERAME) === 1 && (
                      <div className="flex items-center px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
                        <AlertTriangle className="h-3 w-3 text-red-500 mr-2" />
                        <span className="text-xs font-medium text-red-300">DERAME</span>
                      </div>
                    )}
                  </div>
                )}

                {isLowLevel && (
                  <div className="flex items-center w-full py-3 px-4 rounded-lg bg-red-950/30 border border-red-900">
                    <AlertTriangle className="text-red-500 mr-3 animate-pulse" size={20} />
                    <div>
                      <span className="text-red-400 font-medium block">
                        Nivel crítico de agua
                      </span>
                      <span className="text-red-300/80 text-sm">
                        Se requiere revisión inmediata del suministro
                      </span>
                    </div>
                  </div>
                )}
                
                {hasWarning && (
                  <div className="flex items-center w-full py-3 px-4 rounded-lg bg-yellow-950/30 border border-yellow-900">
                    <AlertTriangle className="text-yellow-500 mr-3" size={20} />
                    <div>
                      <span className="text-yellow-400 font-medium block">
                        Nivel bajo de agua
                      </span>
                      <span className="text-yellow-300/80 text-sm">
                        Se recomienda revisión del suministro
                      </span>
                    </div>
                  </div>
                )}

                {/* Mostrar botón en dispositivos con datos históricos disponibles */}
                {hasHistorical && (
                                      <button
                      onClick={() => setShowHistorical(true)}
                    className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <History className="mr-2" size={18} />
                    Ver histórico
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <AlertTriangle className="text-gray-500 mb-2" size={32} />
                <p className="text-gray-300">No hay datos para este tanque</p>
              </div>
            )}
          </CardContent>

          {hasData('fecha') && (
            <CardFooter className="bg-gray-800/50 pt-4 pb-3 flex items-center gap-3">
              <Clock className="text-blue-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Registro actualizado</p>
                <p className="font-medium text-gray-100">{formatDate(tankData.fecha)}</p>
              </div>
            </CardFooter>
          )}
        </Card>

        {showHistorical ? (
          <HistoricalChart
            codigoAsada={codigoAsada}
            deviceKey={identifier}
            historicoKey={historicoKey}
            deviceName={name}
            databaseKey={databaseKey}
            deviceType={type}
            onClose={() => setShowHistorical(false)}
          />
        ) : null}
      </>
    );
  }

  if (type === 'pump' || type === 'well' || type === 'centrifugal') {
    const statusAsNumber = Number(
      pumpKey ? (data as any)?.[pumpKey] : (data as any)?.[identifier],
    );
    const hasValue = !isNaN(statusAsNumber);
    const isError = statusAsNumber === 2 || statusAsNumber === 3;

    const isActive = statusAsNumber === 1;

    const renderSensorDetails = () => {
      if (!showDetails) return null;

      return (
        <div className="mt-6 p-4 bg-gray-800/80 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Datos de sensores</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hasData('MODO') && (
              <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
                <Activity className="text-purple-400 mr-3" size={20} />
                <div>
                  <p className="text-xs text-gray-400">MODO DE OPERACIÓN</p>
                  <p className="font-bold text-gray-100">{data.MODO === 1 ? 'Automático' : data.MODO === 0 ? 'Manual' : data.MODO}</p>
                </div>
              </div>
            )}

            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Zap className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">CONSUMO BOMBA</p>
                <p className="font-bold text-gray-100">{hasData('AMPS') ? data.AMPS : "N/D"} A</p>
              </div>
            </div>

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

            {hasData('PRESION') && (
              <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
                <Gauge className="text-blue-400 mr-3" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Presión Bombeo</p>
                  <p className="font-bold text-gray-100">{data.PRESION} psi</p>
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
      <>
        <Card
          className={`bg-gray-900 border-gray-800 shadow-lg ${
            isActive ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-700'
          }`}
        >
          <CardHeader className="bg-gray-800 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
              {hasValue && (
                <div
                  className={`h-3 w-3 rounded-full ${
                    isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {hasValue ? (
              <div className="flex flex-col items-center space-y-6">
                <div 
                  className="w-full flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg bg-gray-800/80 border border-gray-700/50" 
                  onClick={() => setIsDeviceExpanded(!isDeviceExpanded)}
                >
                  <div className="flex items-center">
                    <Activity
                      className={isActive ? 'text-green-400' : 'text-gray-500'}
                      size={20}
                    />
                    <span className="ml-3 font-medium text-gray-100">
                      {isActive ? 'En operación' : 'En reposo'}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                      isDeviceExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                
                {isDeviceExpanded && (
                  <div className="w-full flex flex-col items-center space-y-4">
                                      {type === 'pump' && <PumpIndicator status={statusAsNumber} />}
                  {type === 'well' && <WellIndicator status={statusAsNumber} />}
                  {type === 'centrifugal' && <CentrifugalPumpIndicator status={statusAsNumber} />}
                  </div>
                )}

                {renderSensorDetails()}

                {/* Botón de históricos para bombas y pozos */}
                {hasHistorical && (
                                    <button
                      onClick={() => setShowHistorical(true)}
                    className="mt-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <History className="mr-2" size={18} />
                    Ver histórico
                  </button>
                )}

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <span>{showDetails ? 'Ocultar detalles' : 'Ver detalles de sensores'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${
                      showDetails ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <AlertTriangle className="text-gray-500 mb-2" size={32} />
                <p className="text-gray-300">No hay datos para este dispositivo</p>
              </div>
            )}
          </CardContent>

          {hasData('fecha') && (
            <CardFooter className="bg-gray-800/50 pt-4 pb-3 flex items-center gap-3">
              <Clock className="text-blue-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Última sincronización</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
              </div>
            </CardFooter>
          )}
        </Card>
        
        {showHistorical ? (
          <HistoricalChart
            codigoAsada={codigoAsada}
            deviceKey={identifier}
            historicoKey={historicoKey}
            deviceName={name}
            databaseKey={databaseKey}
            deviceType={type}
            onClose={() => setShowHistorical(false)}
          />
        ) : null}
      </>
    );
  }

  if (type === 'pressure') {
    console.log('Pressure data:', data);
    console.log('data?.PRESION:', data?.PRESION);
    console.log('data?.valor:', data?.valor);
    console.log('data:', data);
    
    const pressureValue = Number(data?.PRESION ?? data?.valor ?? 0);
    const hasPressureValue = !isNaN(pressureValue) && pressureValue !== null && pressureValue !== undefined && pressureValue >= 0;
    
    console.log('pressureValue:', pressureValue);
    console.log('hasPressureValue:', hasPressureValue);

    return (
      <>
        <Card className="bg-gray-900 border-gray-800 shadow-lg transition-all duration-300">
          <CardHeader className="bg-gray-800 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
              <Gauge className="text-blue-400" size={24} />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {hasPressureValue ? (
              <div className="flex flex-col items-center space-y-6">
                <PressureIndicator
                  pressure={pressureValue}
                  maxPressure={100}
                  unit="PSI"
                  pressureRanges={pressureRanges}
                />

                <div className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-800/80 border border-gray-700/50">
                  <Gauge className="text-blue-400 mr-3" size={24} />
                  <span className="text-xl font-bold text-gray-100">{pressureValue.toFixed(1)}</span>
                  <span className="ml-2 text-gray-400">PSI</span>
                </div>

                {/* Botón de históricos para dispositivos de presión */}
                {hasHistorical && (
                  <button
                    onClick={() => setShowHistorical(true)}
                    className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <History className="mr-2" size={18} />
                    Ver histórico
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <AlertTriangle className="text-gray-500 mb-2" size={32} />
                <p className="text-gray-300">No hay datos de presión disponibles</p>
              </div>
            )}
          </CardContent>

          {hasData('fecha') && (
            <CardFooter className="bg-gray-800/50 pt-4 pb-3 flex items-center gap-3">
              <Clock className="text-blue-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Registro actualizado</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
              </div>
            </CardFooter>
          )}
        </Card>

        {showHistorical ? (
          <HistoricalChart
            codigoAsada={codigoAsada}
            deviceKey={identifier}
            historicoKey={historicoKey}
            deviceName={name}
            databaseKey={databaseKey}
            deviceType={type}
            onClose={() => setShowHistorical(false)}
          />
        ) : null}
      </>
    );
  }

  return null;
}
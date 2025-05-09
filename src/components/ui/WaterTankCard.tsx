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
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { BaseDeviceType } from '../../app/types/types';
import { checkHistoricalDataAvailability } from '../../utils/historicalDataUtils';
import HistoricalChart from '../HistoricalChart';

interface WaterTankCardProps {
  identifier: string;
  name: string;
  type: BaseDeviceType; 
  pumpKey?: string;
  codigoAsada: string;
  onAlertChange?: (hasAlert: boolean) => void;
}

export default function WaterTankCard({
  identifier,
  name,
  type,
  pumpKey,
  codigoAsada,
  onAlertChange,
}: WaterTankCardProps) {
  const pumpKeyParam = type === 'pump' || type === 'well' ? undefined : pumpKey;
  const { data, error, loading } = useDeviceData(identifier, pumpKeyParam, codigoAsada);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeviceExpanded, setIsDeviceExpanded] = useState(false);
  const [showHistorical, setShowHistorical] = useState(false);
  const [hasHistorical, setHasHistorical] = useState(false);
  
  const previousAlertRef = React.useRef(false);

  let tankValue;
  let hasAlert = false;
  
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
    hasAlert = tankValue !== undefined && !isNaN(tankValue) && tankValue < 25;
  } else if (type === 'pump' || type === 'well') {
    const statusAsNumber = Number(
      pumpKey ? (data as any)?.[pumpKey] : (data as any)?.[identifier],
    );
    hasAlert = statusAsNumber === 2 || statusAsNumber === 3;
  }

  useEffect(() => {
    if (codigoAsada) {
      // Simplificación: solo mostrar históricos para ASROA sin hacer petición
      setHasHistorical(codigoAsada === 'ASROA');
    }
  }, [codigoAsada]);

  React.useEffect(() => {
    if (!onAlertChange) return;
    
    if (previousAlertRef.current !== hasAlert) {
      previousAlertRef.current = hasAlert;
      onAlertChange(hasAlert);
    }
  }, [hasAlert, onAlertChange]);

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
    let tankData = data;

    const hasTankValue = tankValue !== undefined && tankValue !== null && !isNaN(tankValue);
    const isLowLevel = hasTankValue && tankValue < 25;

    return (
      <>
        <Card
          className={`bg-gray-900 border-gray-800 shadow-lg transition-all duration-300 ${
            isLowLevel ? 'border-l-4 border-l-red-500' : ''
          }`}
        >
          <CardHeader className="bg-gray-800 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
              {isLowLevel && <AlertTriangle className="text-red-500" size={24} />}
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
                        : tankValue < 50
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}
                    size={24}
                  />
                  <span className="text-xl font-bold text-gray-100">{tankValue}%</span>
                  <span className="ml-2 text-gray-400">de capacidad disponible</span>
                </div>

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

                {/* Mostrar botón en todos los tanques */}
                {type === 'tank' && (
                  <button
                    onClick={() => setShowHistorical(true)}
                    className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <History className="mr-2" size={18} />
                    Ver histórico ASADA
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

        {showHistorical && (
          <HistoricalChart
            codigoAsada={codigoAsada}
            deviceKey={identifier}
            deviceName={name}
            onClose={() => setShowHistorical(false)}
          />
        )}
      </>
    );
  }

  if (type === 'pump' || type === 'well') {
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
            <div className="flex items-center bg-gray-700/50 p-3 rounded-lg">
              <Zap className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-xs text-gray-400">CONSUMO BOMBA</p>
                <p className="font-bold text-gray-100">{hasData('AMPS') ? data.AMPS : "N/D"}</p>
              </div>
            </div>

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
                </div>
              )}

              {renderSensorDetails()}

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
    );
  }

  return null;
}
'use client';
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, Droplet, AlertTriangle, Activity } from 'lucide-react';
import { WaterTankIndicator } from '../indicators/WaterTankIndicator';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { BaseDeviceType } from '../../app/types/types';

interface WaterTankCardProps {
  identifier: string;
  name: string;
  type: BaseDeviceType;
  pumpKey?: string;
  codigoAsada: string;
}

export default function WaterTankCard({ identifier, name, type, pumpKey, codigoAsada }: WaterTankCardProps) {
  const { data, error, loading } = useDeviceData(identifier, pumpKey, codigoAsada);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden transition-all duration-300">
        <CardHeader className="bg-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
            <div className="animate-pulse bg-gray-700 h-6 w-6 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-pulse bg-gray-800 h-32 w-32 rounded-full"></div>
            <p className="text-gray-300">Cargando datos...</p>
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
            <p className="text-orange-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'tank') {
    const hasTankValue =
      data && typeof data === 'object' && 'valor' in data && typeof data.valor === 'number';
    
    const isLowLevel = hasTankValue && data.valor < 25;

    return (
      <Card className={`bg-gray-900 border-gray-800 shadow-lg transition-all duration-300 ${isLowLevel ? 'border-l-4 border-l-red-500' : ''}`}>
        <CardHeader className="bg-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
            {isLowLevel && <AlertTriangle className="text-red-500" size={24} />}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {hasTankValue ? (
            <div className="flex flex-col items-center space-y-6">
              <WaterTankIndicator percentage={data.valor} />
              
              <div className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-gray-800">
                <Droplet className={`mr-2 ${data.valor < 25 ? 'text-red-500' : 'text-green-400'}`} size={24} />
                <span className="text-xl font-bold text-gray-100">{data.valor}%</span>
                <span className="ml-2 text-gray-400">de capacidad</span>
              </div>
              
              {isLowLevel && (
                <div className="flex items-center w-full py-2 px-4 rounded-lg bg-red-950/30 border border-red-900">
                  <AlertTriangle className="text-red-500 mr-2" size={20} />
                  <span className="text-red-400 font-medium">¡Alerta de nivel bajo!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <AlertTriangle className="text-gray-500 mb-2" size={32} />
              <p className="text-gray-300">No hay datos para este tanque</p>
            </div>
          )}
        </CardContent>
        
        {hasTankValue && (
          <CardFooter className="bg-gray-800/50 pt-4 pb-3 flex items-center gap-2">
            <Clock className="text-gray-400" size={18} />
            <div>
              <p className="text-xs text-gray-400">Última lectura</p>
              <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  } else if (type === 'pump' || type === 'well') {
    const numericValue = Number(data);
    const hasValue = !isNaN(numericValue);
    const isActive = numericValue === 1;
    
    return (
      <Card className={`bg-gray-900 border-gray-800 shadow-lg ${isActive ? 'border-l-4 border-l-green-500' : ''}`}>
        <CardHeader className="bg-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
            {hasValue && (
              <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {hasValue ? (
            <div className="flex flex-col items-center space-y-6">
              {type === 'pump' && <PumpIndicator status={numericValue} />}
              {type === 'well' && <WellIndicator status={numericValue} />}
              
              <div className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-800">
                <Activity className={isActive ? 'text-green-400' : 'text-gray-500'} size={24} />
                <span className="ml-3 font-medium text-gray-100">
                  Estado: <span className={isActive ? 'text-green-400' : 'text-gray-400'}>
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <AlertTriangle className="text-gray-500 mb-2" size={32} />
              <p className="text-gray-300">No hay datos para este dispositivo</p>
            </div>
          )}
        </CardContent>
        
        {hasValue && (
          <CardFooter className="bg-gray-800/50 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Última lectura</p>
                <p className="font-medium text-gray-100">Valor: {numericValue}</p>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }

  return null;
}
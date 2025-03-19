'use client';
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, AlertTriangle, Activity, Settings } from 'lucide-react';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
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
            <p className="text-gray-300 mt-4">Cargando dispositivos...</p>
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

  const activeDevices = devices.filter(
    (device) => data && device.pumpKey in data && data[device.pumpKey] !== undefined
  );
  
  const activeDeviceCount = activeDevices.length;
  
  const onDeviceCount = activeDevices.filter(
    (device) => Number(data[device.pumpKey]) === 1
  ).length;

  if (!activeDeviceCount) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
        <CardHeader className="bg-gray-800 pb-2">
          <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col items-center py-8">
            <AlertTriangle className="text-gray-500 mb-2" size={32} />
            <p className="text-gray-300">No hay dispositivos activos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gray-800 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{onDeviceCount}/{activeDeviceCount} activos</span>
            <div className={`h-3 w-3 rounded-full ${onDeviceCount > 0 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {activeDevices.map((device) => {
              const statusAsNumber = Number(data[device.pumpKey]);
              const isActive = statusAsNumber === 1;
              
              return (
                <div 
                  key={device.pumpKey} 
                  className={`flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all duration-300 ${
                    isActive ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-700'
                  }`}
                >
                  <h3 className="text-lg font-medium text-gray-200 mb-2">{device.name}</h3>

                  {device.type === 'pump' && (
                    <PumpIndicator status={statusAsNumber} />
                  )}
                  {device.type === 'well' && (
                    <WellIndicator status={statusAsNumber} />
                  )}
                  
                  <div className="flex items-center justify-center w-full mt-4 py-2 px-3 rounded-md bg-gray-900/50">
                    <Activity className={isActive ? 'text-green-400' : 'text-gray-500'} size={18} />
                    <span className="ml-2 text-sm font-medium text-gray-200">
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-800/50 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="text-gray-400" size={18} />
          <div>
            <p className="text-xs text-gray-400">Última lectura</p>
            <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
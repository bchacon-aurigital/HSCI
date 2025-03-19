'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { PumpIndicator } from '../indicators/PumpIndicator';
import { WellIndicator } from '../indicators/WellIndicator';
import { useDeviceData } from '../../hooks/useDeviceData';
import { formatDate } from '../../utils/utils';
import { MultiDeviceCardProps } from '../../app/types/types';

export default function MultiDeviceCard({
  groupName,
  identifier,
  devices,
  codigoAsada,  // Asegúrate de recibir el codigoAsada aquí
}: MultiDeviceCardProps) {
  // Pasamos codigoAsada a la función useDeviceData
  const { data, error, loading } = useDeviceData(identifier, undefined, codigoAsada);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-300">Cargando...</p>
        ) : error ? (
          <p className="text-orange-500">{error}</p>
        ) : data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map((device) => {
                const hasDeviceValue =
                  data &&
                  device.pumpKey in data &&
                  data[device.pumpKey] !== undefined;

                if (!hasDeviceValue) return null;

                const statusAsNumber = Number(data[device.pumpKey]);

                return (
                  <div key={device.pumpKey} className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-gray-200 mb-2">{device.name}</h3>

                    {device.type === 'pump' && (
                      <PumpIndicator status={statusAsNumber} />
                    )}
                    {device.type === 'well' && (
                      <WellIndicator status={statusAsNumber} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Última lectura</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
                </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

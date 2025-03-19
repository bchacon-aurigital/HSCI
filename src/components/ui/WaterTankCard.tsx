'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Droplet } from 'lucide-react';
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
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Cargando...</p>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // For tanks, data is expected to be an object with "valor" and "fecha" properties
  if (type === 'tank') {
    const hasTankValue =
      data && typeof data === 'object' && 'valor' in data && typeof data.valor === 'number';

    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
        </CardHeader>
        <CardContent>
          {hasTankValue ? (
            <>
              <WaterTankIndicator percentage={data.valor} />
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Última lectura</p>
                  <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Nivel del tanque</p>
                  <p className="font-medium">
                    {data.valor}% Full
                    {data.valor < 25 && (
                      <span className="ml-2 text-red-500 text-sm">
                        (¡Alerta de nivel bajo!)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-300">No hay datos para este tanque</p>
          )}
        </CardContent>
      </Card>
    );
  } else if (type === 'pump' || type === 'well') {
    // For pumps and wells, the hook returns a direct value (e.g., "0" or "1")
    const numericValue = Number(data);
    const hasValue = !isNaN(numericValue);

    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
        </CardHeader>
        <CardContent>
          {hasValue ? (
            <>
              {type === 'pump' && <PumpIndicator status={numericValue} />}
              {type === 'well' && <WellIndicator status={numericValue} />}
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Última lectura</p>
                  <p className="font-medium text-gray-100">Valor: {numericValue}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-300">No hay datos para este dispositivo</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

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
  url: string;
  name: string;
  type: BaseDeviceType;
  pumpKey?: string;
}

export default function WaterTankCard({ url, name, type, pumpKey }: WaterTankCardProps) {
  const { data, error, loading } = useDeviceData(url);

  // Verificar si es un tanque y tiene valor antes de renderizar el indicador
  const hasTankValue = type === 'tank' && data && 'valor' in data && typeof data.valor === 'number';
  
  // Verificar si es una bomba o pozo y tiene el valor correspondiente
  const hasPumpValue = type === 'pump' && data && pumpKey && pumpKey in data && typeof data[pumpKey] === 'number';
  const hasWellValue = type === 'well' && data && pumpKey && pumpKey in data && typeof data[pumpKey] === 'number';

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-300">Cargando...</p>
        ) : error ? (
          <p className="text-orange-500">{error}</p>
        ) : data ? (
          <div className="space-y-4">
            {/* Solo renderiza el componente si se ha verificado que los valores existen */}
            {hasTankValue && <WaterTankIndicator percentage={data.valor as number} />}
            {hasPumpValue && <PumpIndicator status={data[pumpKey as string] as number} />}
            {hasWellValue && <WellIndicator status={data[pumpKey as string] as number} />}
            
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Última lectura</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
              </div>
            </div>

            {hasTankValue && (
              <div className="flex items-center gap-2">
                <Droplet className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Nivel del tanque</p>
                  <p className="font-medium">
                    {data.valor}% Full
                    {(data.valor as number) < 25 && (
                      <span className="ml-2 text-red-500 text-sm">
                        (¡Alerta de nivel bajo!)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
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
  // "identifier" puede ser una URL (dispositivos individuales) o una key (dispositivos agrupados)
  identifier: string;
  name: string;
  type: BaseDeviceType;
  pumpKey?: string;
}

export default function WaterTankCard({ identifier, name, type, pumpKey }: WaterTankCardProps) {
  const { data, error, loading } = useDeviceData(identifier, pumpKey);

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

  // Para tanques, se espera que "data" sea un objeto con la propiedad "valor" y "fecha"
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
    // Para bombas y pozos, el hook retorna directamente un valor (por ejemplo, "0" o "1").
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
                  {/* Si en el caso de bombas/pozos no se cuenta con una fecha, se muestra el valor */}
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

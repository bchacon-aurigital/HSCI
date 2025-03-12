'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { PumpIndicator, WellIndicator } from './WaterTankCard'; // Importamos los componentes de indicadores

interface DeviceData {
  fecha: string;
  [key: string]: any;  // Allow for various device keys
}

interface DeviceGroup {
  name: string;
  url: string;
  devices: {
    name: string;
    type: 'pump' | 'well';
    key: string;
  }[];
}

// Función para formatear la fecha (igual que en WaterTankCard)
const formatDate = (fecha: string) => {
  try {
    const parts = fecha.split('..');
    const [day, month, year] = parts[0].split('.');
    const time = parts[1].replace('.', ':');
    return `${parseInt(day)} de ${[
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][parseInt(month) - 1]
    } de ${year}, ${time}`;
  } catch {
    return fecha;
  }
};

export default function MultiDeviceCard({ group }: { group: DeviceGroup }) {
  const [data, setData] = useState<DeviceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(group.url);
        if (!response.ok) throw new Error('Error en la conexión');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Error al obtener datos');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [group.url]);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-100">{group.name}</h2>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.devices.map((device) => (
                <div key={device.key} className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-gray-200 mb-2">{device.name}</h3>
                  {device.type === 'pump' && data[device.key] !== undefined && (
                    <PumpIndicator status={data[device.key]} />
                  )}
                  {device.type === 'well' && data[device.key] !== undefined && (
                    <WellIndicator status={data[device.key]} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Última lectura</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <p className="text-orange-500">{error}</p>
        ) : (
          <p className="text-gray-300">Cargando...</p>
        )}
      </CardContent>
    </Card>
  );
}
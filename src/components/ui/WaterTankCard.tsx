'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Droplet } from 'lucide-react';

interface TankData {
  fecha: string;
  valor: number;
}

const WaterTankIndicator = ({ percentage }: { percentage: number }) => {
  const getFillColor = (level: number) => {
    if (level > 50) return '#22c55e'; // green-500
    if (level > 25) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  const maxHeight = 140;
  const fillHeight = (percentage / 100) * maxHeight;
  const yPosition = 150 - fillHeight;

  return (
    <svg viewBox="0 0 100 160" className="w-44 h-48 mx-auto">
      <path d="M10,10 h80 v140 h-80 z" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y={yPosition} width="80" height={fillHeight} fill={getFillColor(percentage)} opacity="0.8" />
      <text x="50" y="80" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{`${percentage}%`}</text>
      
      <line x1="5" y1="40" x2="15" y2="40" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="44" fill="currentColor" fontSize="10" textAnchor="end">75%</text>
      
      <line x1="5" y1="80" x2="15" y2="80" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="84" fill="currentColor" fontSize="10" textAnchor="end">50%</text>
      
      <line x1="5" y1="120" x2="15" y2="120" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="124" fill="currentColor" fontSize="10" textAnchor="end">25%</text>
    </svg>
  );
};

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

export default function WaterTankCard({ url, name }: { url: string; name: string }) {
  const [data, setData] = useState<TankData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
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
  }, [url]);

  const getStatusColor = (value: number) => {
    if (value > 50) return 'text-green-500';
    if (value > 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <WaterTankIndicator percentage={data.valor} />
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Última lectura</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className={`${getStatusColor(data.valor)}`} size={20} />
              <div>
                <p className="text-sm text-gray-400">Nivel del tanque</p>
                <p className={`font-medium ${getStatusColor(data.valor)}`}>{data.valor}% Full</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">Cargando...</p>
        )}
      </CardContent>
    </Card>
  );
}

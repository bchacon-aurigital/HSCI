'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Droplet } from 'lucide-react';

interface TankData {
  fecha: string;
  valor: number;
}

interface PumpData {
  fecha: string;
  [key: string]: any;  
}

interface WellData {
  fecha: string;
  [key: string]: any; 
}

const WaterTankIndicator = ({ percentage }: { percentage: number }) => {
  const getFillColor = (level: number) => {
    if (level > 50) return '#22c55e'; 
    if (level > 25) return '#eab308'; 
    return '#ef4444'; 
  };

  const maxHeight = 140;
  const fillHeight = (percentage / 100) * maxHeight;
  const yPosition = 150 - fillHeight;

  return (
    <svg viewBox="0 0 100 160" className="w-44 h-48 mx-auto">
      <path d="M10,10 h80 v140 h-80 z" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y={yPosition} width="80" height={fillHeight} fill={getFillColor(percentage)} opacity="0.8" />
      <text x="50" y="80" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{`${percentage}%`}</text>
      
      <line x1="5" y1="46" x2="15" y2="46" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="44" fill="currentColor" fontSize="10" textAnchor="end">75%</text>
      
      <line x1="5" y1="86" x2="15" y2="86" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="84" fill="currentColor" fontSize="10" textAnchor="end">50%</text>
      
      <line x1="5" y1="126" x2="15" y2="126" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="124" fill="currentColor" fontSize="10" textAnchor="end">25%</text>
    </svg>
  );
};

export const PumpIndicator = ({ status }: { status: number }) => {
  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const labels = ['Reposo', 'Operación', 'Falla', 'Selector Fuera'];
  
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-48 mx-auto">
      <rect x="31" y="24" width="15" height="18" fill={statusColors[status]} stroke="currentColor" strokeWidth="2" />
      
      <circle cx="50" cy="50" r="20" fill={statusColors[status]} stroke="currentColor" strokeWidth="2" />
          
      <circle cx="50" cy="50" r="10" fill="white" stroke="currentColor" strokeWidth="1" />
      
      <path d="M50 40 Q55 45 50 50 Q45 45 50 40" fill="white" />
      <path d="M50 50 Q55 55 50 60 Q45 55 50 50" fill="white" />
      <path d="M40 50 Q45 55 50 50 Q45 45 40 50" fill="white" />
      <path d="M50 50 Q55 45 60 50 Q55 55 50 50" fill="white" />
      
      <rect x="30" y="68" width="40" height="10" fill="currentColor" />
      
      <text x="50" y="95" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">{labels[status]}</text>
    </svg>
  );
};

export const WellIndicator = ({ status }: { status: number }) => {
  const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
  const labels = ['Reposo', 'Operación', 'Falla', 'Selector Fuera'];
  
  return (
    <svg viewBox="0 0 100 120" className="w-32 h-48 mx-auto">
      <rect x="35" y="10" width="30" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
      
      <rect x="35" y="40" width="30" height="10" fill="#374151" />
      
      <line x1="35" y1="40" x2="65" y2="40" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="42" x2="65" y2="42" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="44" x2="65" y2="44" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="46" x2="65" y2="46" stroke="white" strokeWidth="0.8" />
      <line x1="35" y1="48" x2="65" y2="48" stroke="white" strokeWidth="0.8" />
      
      <line x1="39" y1="40" x2="39" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="43" y1="40" x2="43" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="47" y1="40" x2="47" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="51" y1="40" x2="51" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="55" y1="40" x2="55" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="59" y1="40" x2="59" y2="50" stroke="white" strokeWidth="0.8" />
      <line x1="63" y1="40" x2="63" y2="50" stroke="white" strokeWidth="0.8" />
      
      <rect x="35" y="50" width="30" height="35" fill={statusColors[status]} stroke="currentColor" strokeWidth="1" />
      
      <line x1="40" y1="55" x2="40" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="45" y1="55" x2="45" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="50" y1="55" x2="50" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="55" y1="55" x2="55" y2="80" stroke="white" strokeWidth="1.5" />
      <line x1="60" y1="55" x2="60" y2="80" stroke="white" strokeWidth="1.5" />
      
      <text x="50" y="105" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">{labels[status]}</text>
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

export default function WaterTankCard({ 
  url, 
  name, 
  type, 
  pumpKey 
}: { 
  url: string; 
  name: string; 
  type: 'tank' | 'pump' | 'well'; 
  pumpKey?: string;
}) {
  const [data, setData] = useState<TankData | PumpData | WellData | null>(null);
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

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-100">{name}</h2>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            {type === 'tank' && 'valor' in data && <WaterTankIndicator percentage={data.valor} />}
            {type === 'pump' && pumpKey && (data as PumpData)[pumpKey] !== undefined && (
              <PumpIndicator status={(data as PumpData)[pumpKey]} />
            )}
            {type === 'well' && pumpKey && (data as WellData)[pumpKey] !== undefined && (
              <WellIndicator status={(data as WellData)[pumpKey]} />
            )}
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
                  <p className={`font-medium`}>
                    {data.valor}% Full
                    {data.valor < 25 && (
                      <span className="ml-2 text-red-500 text-sm">
                        (¡Alerta de nivel bajo!)
                      </span>
                    )}
                  </p>
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
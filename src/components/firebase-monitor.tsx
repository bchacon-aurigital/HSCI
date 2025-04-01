// src/components/firebase-monitor.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Droplet } from 'lucide-react';

interface FirebaseData {
  fecha: string;
  valor: number;
}

const WaterTankIndicator = ({ percentage }: { percentage: number }) => {
  // Determine color based on percentage
  const getFillColor = (level: number) => {
    if (level > 50) return '#22c55e'; // green-500
    if (level > 25) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  // Calculate the height and y-position for the water level
  const maxHeight = 140; // Total fillable height
  const fillHeight = (percentage / 100) * maxHeight;
  const yPosition = 150 - fillHeight; // Start from bottom (150) minus the fill height

  return (
    <svg
      viewBox="0 0 100 160"
      className="w-32 h-48 mx-auto"
      style={{ minWidth: '170px' }}
    >
      {/* Tank outline */}
      <path
        d="M10,10 h80 v140 h-80 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Water level */}
      <rect
        x="10"
        y={yPosition}
        width="80"
        height={fillHeight}
        fill={getFillColor(percentage)}
        opacity="0.8"
      >
        <animate
          attributeName="height"
          from="0"
          to={fillHeight}
          dur="1s"
          fill="freeze"
        />
        <animate
          attributeName="y"
          from="150"
          to={yPosition}
          dur="1s"
          fill="freeze"
        />
      </rect>

      {/* Percentage text */}
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        className="drop-shadow-md"
      >
        {`${percentage}%`}
      </text>

      {/* Level marks and percentage markers - Moved to left side */}
      <line x1="5" y1="40" x2="15" y2="40" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="44" fill="currentColor" fontSize="10" textAnchor="end">75%</text>
      
      <line x1="5" y1="80" x2="15" y2="80" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="84" fill="currentColor" fontSize="10" textAnchor="end">50%</text>
      
      <line x1="5" y1="120" x2="15" y2="120" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="124" fill="currentColor" fontSize="10" textAnchor="end">25%</text>
    </svg>
  );
};

export default function FirebaseMonitor() {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number) => {
    if (value > 50) return 'text-green-500';
    if (value > 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-4 bg-gray-900">
        <CardContent className="p-4">
          <p className="text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-4 bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100">Monitoreo en tiempo real: Tanque 3 Bahías</h2>
      </CardHeader>
      <CardContent className="p-4">
        {data ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <WaterTankIndicator percentage={data.valor} />
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Registro más reciente</p>
                  <p className="font-medium text-gray-100">{data.fecha}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Droplet className={`${getStatusColor(data.valor)}`} size={20} />
                <div>
                  <p className="text-sm text-gray-400">Capacidad actual</p>
                  <p className={`font-medium ${getStatusColor(data.valor)}`}>
                    {data.valor}% lleno
                    {data.valor < 25 && (
                      <span className="ml-2 text-red-500 text-sm">
                        (Nivel crítico: Se requiere atención)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {lastUpdated && (
              <p className="text-sm text-gray-400 pt-2 border-t border-gray-800">
                Actualizado: {lastUpdated} <span className="text-blue-400">• Datos en tiempo real</span>
              </p>
            )}
          </div>
        ) : (
            <p className="text-center py-4 text-gray-300 flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Obteniendo datos en tiempo real...
            </p>
        )}
      </CardContent>
    </Card>
  );
}
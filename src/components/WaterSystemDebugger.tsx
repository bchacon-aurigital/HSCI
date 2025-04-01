"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { WaterTankIndicator } from './indicators/WaterTankIndicator';
import { PumpIndicator } from './indicators/PumpIndicator';
import { WellIndicator } from './indicators/WellIndicator';

const DepuradorSistemaAgua = () => {
  const [tipoDispositivo, setTipoDispositivo] = useState('tanque');
  // Valores separados para cada tipo de dispositivo
  const [nivelTanque, setNivelTanque] = useState(50); // 0-100 para tanques
  const [estadoBomba, setEstadoBomba] = useState(1); // 0-3 para bombas
  const [estadoPozo, setEstadoPozo] = useState(2); // 0-3 para pozos

  const [guiaExpandida, setGuiaExpandida] = useState(false);

  // Obtener el valor correspondiente según el tipo de dispositivo
  const obtenerValorActual = () => {
    switch (tipoDispositivo) {
      case 'tanque': return nivelTanque;
      case 'bomba': return estadoBomba;
      case 'pozo': return estadoPozo;
      default: return 0;
    }
  };

  // Actualizar el valor correspondiente según el tipo de dispositivo
  const actualizarValor = (nuevoValor: string | number): void => {
    const valor = parseInt(nuevoValor.toString());
    switch (tipoDispositivo) {
      case 'tanque': 
        setNivelTanque(valor);
        break;
      case 'bomba': 
        setEstadoBomba(valor);
        break;
      case 'pozo': 
        setEstadoPozo(valor);
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Centro de Diagnóstico de Indicadores</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-gray-200 block mb-2">Tipo de Dispositivo:</label>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded ${tipoDispositivo === 'tanque' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('tanque')}
                >
                  Tanque
                </button>
                <button 
                  className={`px-4 py-2 rounded ${tipoDispositivo === 'bomba' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('bomba')}
                >
                  Bomba
                </button>
                <button 
                  className={`px-4 py-2 rounded ${tipoDispositivo === 'pozo' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setTipoDispositivo('pozo')}
                >
                  Pozo
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-200 block mb-2">
                {tipoDispositivo === 'tanque' ? 'Nivel de Agua (%)' : 'Estado (0-3)'}:
              </label>
              <input 
                type="range" 
                min={tipoDispositivo === 'tanque' ? 0 : 0} 
                max={tipoDispositivo === 'tanque' ? 100 : 3} 
                step={tipoDispositivo === 'tanque' ? 1 : 1}
                value={obtenerValorActual()}
                onChange={(e) => actualizarValor(e.target.value)}
                className="w-full"
              />
              <div className="text-white mt-1">{obtenerValorActual()}</div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => setGuiaExpandida(!guiaExpandida)}
                className="w-full flex items-center justify-between bg-gray-700 p-4 rounded-t text-gray-200 hover:bg-gray-600 transition-all duration-200"
              >
                <h3 className="text-lg font-medium">Guía de diagnóstico</h3>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform duration-300 ${guiaExpandida ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`bg-gray-700 p-4 rounded-b overflow-hidden transition-all duration-300 ${
                  guiaExpandida ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'
                }`}
              >
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Verificar si el componente correcto está importado</li>
                  <li>Comprobar que los tipos de props coinciden exactamente</li>
                  <li>Para MultiDeviceCard, asegurar que <code>device.type</code> esté configurado correctamente</li>
                  <li>Verificar que la estructura de datos del backend contiene las claves esperadas</li>
                  <li>Revisar la respuesta de red en la consola del navegador</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Vista Previa</h2>
            <div className="flex justify-center">
              {tipoDispositivo === 'tanque' && <WaterTankIndicator percentage={nivelTanque} />}
              {tipoDispositivo === 'bomba' && <PumpIndicator status={estadoBomba} />}
              {tipoDispositivo === 'pozo' && <WellIndicator status={estadoPozo} />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100">Ejemplo de Tanque</h2>
          </CardHeader>
          <CardContent>
            <WaterTankIndicator percentage={75} />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100">Ejemplo de Bomba</h2>
          </CardHeader>
          <CardContent>
            <PumpIndicator status={1} />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100">Ejemplo de Pozo</h2>
          </CardHeader>
          <CardContent>
            <WellIndicator status={2} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepuradorSistemaAgua;
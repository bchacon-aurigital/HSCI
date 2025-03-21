'use client';
import React, { useState, useEffect } from 'react';
import Login from '../Login';
import WaterTankCard from './WaterTankCard';
import MultiDeviceCard from './MultiDeviceCard';
import { useDeviceGroups } from '../../hooks/useDeviceGroups';
import { BaseDeviceType, MultiDevice } from '../../app/types/types';
import { loadDevicesForAsada } from '../../hooks/dynamicDeviceLoader';

export default function WaterSystemColumns() {
  const [codigoAsada, setCodigoAsada] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nombreAsada, setNombreAsada] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const handleLogin = (codigo: string) => {
    setLoading(true);
    setCodigoAsada(codigo);
    setIsLoggedIn(true);
  };

  const processedGroups = useDeviceGroups(codigoAsada);

  useEffect(() => {
    if (codigoAsada) {
      loadDevicesForAsada(codigoAsada).then(({ name }) => {
        setNombreAsada(name);
        setLoading(false);
      });
    }
  }, [codigoAsada]);

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="min-h-screen rounded-2xl text-white py-4">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-[#0b1729] to-[#172236]">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <header className="mb-12">
                <div className="relative py-16 bg-[#0d1b2a] rounded-lg shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply"></div>
                  <div className="relative z-10 px-8">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/50 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24">
                          <path
                            d="M12 2.69c-.23 0-.42.09-.59.21C9.97 4.22 4 9.08 4 15.5 4 19.58 7.42 23 12 23s8-3.42 8-7.5c0-6.42-5.97-11.28-7.41-12.6-.17-.12-.36-.21-.59-.21z"
                            fill="white"
                            stroke="white"
                          />
                        </svg>
                      </div>
                      <h1 className="text-xl font-semibold text-blue-300">Sistema de Monitoreo Remoto</h1>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {nombreAsada}
                    </h2>
                    <p className="text-blue-200 text-lg">
                      Panel de monitoreo de dispositivos
                    </p>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedGroups.map((group) => (
                  <div key={group.name} className="flex flex-col h-full">
                    <div className="bg-[#172236] border border-blue-500/20 rounded-lg shadow-lg overflow-hidden mb-4">
                      <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 p-4 border-b border-blue-500/20">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-bold text-white flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-600/30 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            {group.name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </h2>
                          <button 
                            onClick={() => toggleGroupCollapse(group.name)}
                            className="p-2 rounded-full hover:bg-blue-800/30 transition-colors duration-200"
                            aria-label={collapsedGroups[group.name] ? "Expandir" : "Comprimir"}
                          >
                            {collapsedGroups[group.name] ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      {!collapsedGroups[group.name] && (
                        <div className="p-4 space-y-4">
                          {[...group.devices]
                            .sort((a, b) => a.order - b.order)
                            .map((device) => {
                              const identifier = device.url ? device.url : device.key!;
                              if ('multiDevices' in device) {
                                const multiDevice = device as MultiDevice;
                                return (
                                  <MultiDeviceCard
                                    key={`multi-${identifier}`}
                                    groupName={device.name}
                                    identifier={identifier}
                                    devices={multiDevice.multiDevices}
                                    codigoAsada={codigoAsada}
                                  />
                                );
                              } else {
                                return (
                                  <WaterTankCard
                                    key={`${identifier}-${device.name}-${device.pumpKey || ''}`}
                                    name={device.name}
                                    identifier={identifier}
                                    type={device.type as BaseDeviceType}
                                    pumpKey={device.pumpKey}
                                    codigoAsada={codigoAsada}
                                  />
                                );
                              }
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <footer className="mt-16 pb-8 text-center text-blue-300/50 text-sm">
                <div className="mx-auto max-w-lg border-t border-blue-500/20 pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
                    <span>Sistema en línea</span>
                  </div>
                  <p>© {new Date().getFullYear()} Sistema de Monitoreo HSCI</p>
                </div>
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
}
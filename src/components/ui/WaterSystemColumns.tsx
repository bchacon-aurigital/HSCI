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

  const handleLogin = (codigo: string) => {
    setCodigoAsada(codigo);
    setIsLoggedIn(true);
  };

  const processedGroups = useDeviceGroups(codigoAsada);
  
  useEffect(() => {
    if (codigoAsada) {
      loadDevicesForAsada(codigoAsada).then(({ name }) => {
        setNombreAsada(name);
      });
    }
  }, [codigoAsada]);

  return (
    <div className="container mx-auto p-4">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1 className="text-5xl py-24 text-center mx-auto">
            Sistema de monitoreo remoto de: {nombreAsada}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {processedGroups.map((group) => (
              <div key={group.name} className="flex flex-col h-full">
                <h2 className="text-lg font-bold mb-2">
                  {group.name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h2>
                <div className="flex-1 flex flex-col gap-2">
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
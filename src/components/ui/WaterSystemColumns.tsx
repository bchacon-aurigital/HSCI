'use client';
import React from 'react';
import WaterTankCard from './WaterTankCard';
import MultiDeviceCard from './MultiDeviceCard';
import { useDeviceGroups } from '../../hooks/useDeviceGroups';
import { BaseDeviceType } from '../../app/types/types';

export default function WaterSystemColumns() {
  const processedGroups = useDeviceGroups();
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {processedGroups.map(group => (
          <div key={group.name} className="flex flex-col h-full">
            <h2 className="text-lg font-bold mb-2">
              {group.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            <div className="flex-1 flex flex-col gap-2">
              {[...group.devices]
                .sort((a, b) => a.order - b.order)
                .map(device => {
                  if ('multiDevices' in device) {
                    return (
                      <MultiDeviceCard 
                        key={`multi-${device.url}`}
                        groupName={device.name}
                        url={device.url}
                        devices={device.multiDevices}
                      />
                    );
                  } else {
                    return (
                      <WaterTankCard 
                        key={`${device.url}-${device.name}-${device.pumpKey || ''}`} 
                        name={device.name} 
                        url={device.url} 
                        type={device.type as BaseDeviceType}
                        pumpKey={device.pumpKey}
                      />
                    );
                  }
                })
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
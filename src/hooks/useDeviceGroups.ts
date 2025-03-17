import { useMemo } from 'react';
import { Device, DeviceGroup, MultiDevice } from '../app/types/types';
import { devices } from '../app/data/devicesConfig';

export const useDeviceGroups = () => {
  const deviceGroups = useMemo<DeviceGroup[]>(() => {
    const groupMap: Record<string, Device[]> = {};
    
    devices.forEach(device => {
      if (!groupMap[device.group]) {
        groupMap[device.group] = [];
      }
      groupMap[device.group].push(device);
    });
    
    return Object.entries(groupMap).map(([group, deviceList]) => ({
      name: group,
      devices: deviceList
    }));
  }, []);

  const processedGroups = useMemo<DeviceGroup[]>(() => {
    return deviceGroups.map(group => {
      const groupDevices: (Device | MultiDevice)[] = [...group.devices];
      
      interface UrlGroup {
        devices: {
          name: string;
          type: 'pump' | 'well';
          pumpKey: string;
        }[];
        toRemove: Device[];
      }
      
      const urlGroups: Record<string, UrlGroup> = {};
      
      groupDevices.forEach(device => {
        if ((device.type === 'pump' || device.type === 'well') && device.pumpKey) {
          if (!urlGroups[device.url]) {
            urlGroups[device.url] = {
              devices: [],
              toRemove: []
            };
          }
          urlGroups[device.url].devices.push({
            name: device.name,
            type: device.type as 'pump' | 'well', 
            pumpKey: device.pumpKey
          });
          urlGroups[device.url].toRemove.push(device);
        }
      });
      
      Object.entries(urlGroups).forEach(([url, { devices: urlDevices, toRemove }]) => {
        if (urlDevices.length > 1) {
          toRemove.forEach(device => {
            const index = groupDevices.findIndex(d => 
              d.name === device.name && 
              d.url === device.url && 
              d.pumpKey === device.pumpKey
            );
            if (index !== -1) {
              groupDevices.splice(index, 1);
            }
          });
          
          const averageOrder = toRemove.reduce((sum, device) => sum + device.order, 0) / toRemove.length;
          
          const multiDevice: MultiDevice = {
            name: `${group.name.toUpperCase()} - MULTIPLE`,
            url,
            type: 'multi',
            group: group.name,
            multiDevices: urlDevices,
            order: averageOrder 
          };
          
          groupDevices.push(multiDevice);
        }
      });
      
      return {
        ...group,
        devices: groupDevices
      };
    });
  }, [deviceGroups]);

  return processedGroups;
};
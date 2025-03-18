// useDeviceGroups.ts
import { useState, useEffect, useMemo } from 'react';
import { loadDevicesForAsada } from './dynamicDeviceLoader';
import { Device } from '../app/types/types';

export const useDeviceGroups = (codigoAsada: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadDevicesForAsada(codigoAsada)
      .then(({ devices: deviceList }) => {
        setDevices(deviceList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar los dispositivos:', error);
        setLoading(false);
      });
  }, [codigoAsada]);

  const groupedDevices = useMemo(() => {
    if (loading) return [];

    const groupMap: Record<string, Device[]> = {};
    devices.forEach((device) => {
      if (!groupMap[device.group]) {
        groupMap[device.group] = [];
      }
      groupMap[device.group].push(device);
    });

    const groups = Object.entries(groupMap).map(([groupName, deviceList]) => {
      const multiDevicesMap: Record<string, Device[]> = {};
      const restDevices: Device[] = [];

      deviceList.forEach((device) => {
        if (device.type === 'pump' || device.type === 'well') {
          const groupingKey = device.key ? device.key : device.url!;
          if (groupingKey) {
            if (!multiDevicesMap[groupingKey]) {
              multiDevicesMap[groupingKey] = [];
            }
            multiDevicesMap[groupingKey].push(device);
          } else {
            restDevices.push(device);
          }
        } else {
          restDevices.push(device);
        }
      });

      Object.entries(multiDevicesMap).forEach(([key, devicesWithKey]) => {
        if (devicesWithKey.length > 1) {
          const multiDevice = {
            name: devicesWithKey[0].name,
            key,
            type: 'multi' as const,
            group: groupName,
            order: Math.min(...devicesWithKey.map((d) => d.order)),
            multiDevices: devicesWithKey.map((d) => ({
              name: d.name,
              type: d.type as 'pump' | 'well',
              pumpKey: d.pumpKey!,
            })),
          };
          restDevices.push(multiDevice);
        } else {
          restDevices.push(devicesWithKey[0]);
        }
      });

      restDevices.sort((a, b) => a.order - b.order);
      return { name: groupName, devices: restDevices };
    });
    return groups;
  }, [devices, loading]);

  return groupedDevices;
};

// useDeviceGroups.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadDevicesForAsada } from './dynamicDeviceLoader';
import { Device } from '../app/types/types';
import { triggerRefresh, subscribeToDataUpdates } from './useAggregatedData';

export const useDeviceGroups = (codigoAsada: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadDevices = useCallback(async () => {
    if (!codigoAsada) return;
    setLoading(true);
    try {
      // Usar triggerRefresh para actualizar los datos agregados
      await triggerRefresh();
      const { devices: deviceList } = await loadDevicesForAsada(codigoAsada);
      setDevices(deviceList);
    } catch (error) {
      console.error('Error al recargar los dispositivos:', error);
    } finally {
      setLoading(false);
    }
  }, [codigoAsada]);

  // Cargar dispositivos inicialmente
  useEffect(() => {
    reloadDevices();
    
    // Suscribirse a las actualizaciones de datos agregados
    const unsubscribe = subscribeToDataUpdates(() => {
      // Cuando los datos se actualicen, recargar los dispositivos sin mostrar el indicador de carga
      if (codigoAsada) {
        loadDevicesForAsada(codigoAsada)
          .then(({ devices: deviceList }) => {
            setDevices(deviceList);
          })
          .catch(error => {
            console.error('Error al actualizar los dispositivos:', error);
          });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [codigoAsada, reloadDevices]);

  const groupedDevices = useMemo(() => {
    if (loading && devices.length === 0) return [];

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

  return { groupedDevices, loading, reloadDevices };
};

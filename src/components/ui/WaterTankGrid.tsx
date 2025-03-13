'use client';
import { useMemo, useState, useEffect } from 'react';
import WaterTankCard from './WaterTankCard';
import { PumpIndicator, WellIndicator } from './WaterTankCard';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Droplet } from 'lucide-react';
type BaseDeviceType = 'tank' | 'pump' | 'well';
type DeviceType = BaseDeviceType | 'multi';

interface Device {
  name: string;
  url: string;
  type: DeviceType;
  pumpKey?: string;
  group: string;
  order: number; 
}

interface MultiDevice extends Device {
  type: 'multi';
  multiDevices: {
    name: string;
    type: 'pump' | 'well';
    pumpKey: string;
  }[];
}

interface DeviceGroup {
  name: string;
  devices: (Device | MultiDevice)[];
}

interface DeviceData {
  fecha: string;
  valor?: number;
  [key: string]: any;
}

const devices: Device[] = [
  { name: 'VTBLOTE 05 TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B.json', type: 'tank', group: 'vtblote-05', order: 1 },
  { name: 'Rebombeo 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA1', group: 'vtblote-05', order: 2 },
  { name: 'Rebombeo 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA2', group: 'vtblote-05', order: 3 },
  { name: 'VTBLOTE 05 TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json', type: 'tank', group: 'vtblote-05', order: 4 },
  { name: 'POZO MONTANA HE35', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/MONTANA.json', type: 'well', pumpKey: 'BOMBAHE35', group: 'vtblote-05', order: 5 },
  { name: 'POZO MONTANA HE05', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/MONTANA.json', type: 'well', pumpKey: 'BOMBAHE05', group: 'vtblote-05', order: 6 },
  { name: 'VTB CONCRETO TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC1.json', type: 'tank', group: 'vtblote-05', order: 7 },
  { name: 'VTB CONCRETO TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC2.json', type: 'tank', group: 'vtblote-05', order: 8 },

  // Nuevos pozos - POZO VERDE
  { name: 'VISTA LOS SUENOS', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLST1.json', type: 'tank', group: 'vista-suenos', order: 1 },
  { name: 'POZO VERDE H22', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/POZOVERDE.json', type: 'well', pumpKey: 'BOMBAHE22', group: 'vista-suenos', order: 2 },
  { name: 'POZO VERDE H22J', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/POZOVERDE.json', type: 'well', pumpKey: 'BOMBAHE22J', group: 'vista-suenos', order: 3 },
  
  // POZOS GEMELOS
  { name: 'VISTA LA MARINA TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT1.json', type: 'tank', group: 'vista-marina', order: 1 },
  { name: 'VISTA LA MARINA TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT2.json', type: 'tank', group: 'vista-marina', order: 2 },
  { name: 'POZO GEMELO H27', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/GEMELOS.json', type: 'well', pumpKey: 'BOMBAH27', group: 'vista-marina', order: 3 },
  { name: 'POZO GEMELO H28', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/GEMELOS.json', type: 'well', pumpKey: 'BOMBAH28', group: 'vista-marina', order: 4 },
];

const formatDate = (fecha: string): string => {
  try {
    const parts = fecha.split('..');
    const [day, month, year] = parts[0].split('.');
    const time = parts[1].replace('.', ':');
    const monthIndex = parseInt(month) - 1;
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 
      'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${months[monthIndex]} de ${year}, ${time}`;
  } catch {
    return fecha;
  }
};

interface MultiDeviceCardProps {
  groupName: string;
  url: string;
  devices: {
    name: string;
    type: 'pump' | 'well';
    pumpKey: string;
  }[];
}

const MultiDeviceCard = ({ groupName, url, devices }: MultiDeviceCardProps) => {
  const [data, setData] = useState<DeviceData | null>(null);
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
        <h2 className="text-xl font-semibold text-gray-100">{groupName}</h2>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div key={device.pumpKey} className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-gray-200 mb-2">{device.name}</h3>
                  {device.type === 'pump' && data[device.pumpKey] !== undefined && (
                    <PumpIndicator status={data[device.pumpKey]} />
                  )}
                  {device.type === 'well' && data[device.pumpKey] !== undefined && (
                    <WellIndicator status={data[device.pumpKey]} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Última lectura</p>
                <p className="font-medium text-gray-100">{formatDate(data.fecha)}</p>
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
};

export default function WaterSystemColumns() {
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
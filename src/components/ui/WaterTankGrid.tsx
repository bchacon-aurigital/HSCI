'use client';
import WaterTankCard from './WaterTankCard';
import MultiDeviceCard from './MultiDeviceCard';
import { useMemo } from 'react';

const devices: { name: string; url: string; type: "tank" | "pump" | "well"; pumpKey?: string }[] = [
  // Tanques existentes
  { name: 'VTB CONCRETO TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC1.json', type: 'tank' },
  { name: 'VTB CONCRETO TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC2.json', type: 'tank' },
  { name: 'VISTA LOS SUENOS', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLST1.json', type: 'tank' },
  { name: 'VTBLOTE 05 TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json', type: 'tank' },
  { name: 'VTBLOTE 05 TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B.json', type: 'tank' },
  { name: 'VISTA LA MARINA TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT1.json', type: 'tank' },
  { name: 'VISTA LA MARINA TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT2.json', type: 'tank' },
  
  // Bombas existentes
  { name: 'Rebombeo 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA1' },
  { name: 'Rebombeo 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA2' },
  
  // Nuevos pozos - POZO VERDE
  { name: 'POZO VERDE H22', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/POZOVERDE.json', type: 'well', pumpKey: 'BOMBAHE22' },
  
  // POZO VERDE H22J - Corregido URL (tenía una coma en lugar de punto en el original)
  { name: 'POZO VERDE H22J', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/POZOVERDE.json', type: 'well', pumpKey: 'BOMBAHE22J' },
  
  // POZOS GEMELOS
  { name: 'POZO GEMELO H27', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/GEMELOS.json', type: 'well', pumpKey: 'BOMBAH27' },
  { name: 'POZO GEMELO H28', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/GEMELOS.json', type: 'well', pumpKey: 'BOMBAH28' },
  
  // POZOS MONTANA
  { name: 'POZO MONTANA HE35', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/MONTANA.json', type: 'well', pumpKey: 'BOMBAHE35' },
  { name: 'POZO MONTANA HE05', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/MONTANA.json', type: 'well', pumpKey: 'BOMBAHE05' },
];

export default function WaterTankGrid() {
  // Agrupar dispositivos por URL
  const { groupedDevices, singleDevices } = useMemo(() => {
    const urlGroups: Record<string, { name: string; type: string; key?: string }[]> = {};
    const singleDevs: { name: string; url: string; type: 'tank' | 'pump' | 'well'; pumpKey?: string }[] = [];
    
    devices.forEach(device => {
      // Los tanques siempre se muestran individualmente
      if (device.type === 'tank') {
        singleDevs.push(device);
        return;
      }
      
      // Agrupar bombas y pozos por URL
      if (!urlGroups[device.url]) {
        urlGroups[device.url] = [];
      }
      
      urlGroups[device.url].push({
        name: device.name,
        type: device.type,
        key: device.pumpKey
      });
    });
    
    // Convertir el objeto de grupos a un array para renderizar
    const grouped = Object.entries(urlGroups)
      .filter(([_, devices]) => (devices as any[]).length > 1) // Solo grupos con más de un dispositivo
      .map(([url, groupDevices]) => {
        // Crear un nombre de grupo basado en los tipos de dispositivos
const deviceTypes = Array.from(new Set<string>(groupDevices.map(d => d.type)));
        const locationHint = (groupDevices as any[])[0].name.split(' ')[0]; // Tomar la primera palabra como pista de ubicación
        
        return {
          url,
          name: `${locationHint} - ${deviceTypes.join(' & ')}`.toUpperCase(),
          devices: groupDevices as any[]
        };
      });
    
    // Los dispositivos que están solos (no agrupados) van a singleDevs
    Object.entries(urlGroups)
      .filter(([_, devices]) => (devices as any[]).length === 1)
      .forEach(([url, devices]) => {
        const device = (devices as any[])[0];
        singleDevs.push({
          name: device.name,
          url: url,
          type: device.type,
          pumpKey: device.key
        });
      });
    
    return { groupedDevices: grouped, singleDevices: singleDevs };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {/* Renderizar los dispositivos agrupados */}
      {groupedDevices.map((group) => (
        <MultiDeviceCard key={group.url} group={group} />
      ))}
      
      {/* Renderizar los dispositivos individuales */}
      {singleDevices.map((device) => (
        <WaterTankCard 
          key={`${device.url}-${device.name}-${device.pumpKey || ''}`} 
          name={device.name} 
          url={device.url} 
          type={device.type as 'tank' | 'pump' | 'well'} 
          pumpKey={device.pumpKey} 
        />
      ))}
    </div>
  );
}
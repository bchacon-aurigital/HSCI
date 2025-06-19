// devicesConfig4.ts
import { Device, MultiDevice } from '../types/types';

export const devices: (Device | MultiDevice)[] = [
  // RIO SEGUNDO
  { name: 'RIO SEGUNDO', key: 'TVIILAELIA', type: 'tank', group: 'RIO SEGUNDO', order: 1, historicoKey: 'RIOSEG', databaseKey: 'ACUEDUCTOALAJUELA' },
  { name: 'BOMBA RIO SEGUNDO', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACUEDUCTOALAJUELA/RIOSEG/BOMBA.json', pumpKey: 'DATABOMB', type: 'well', group: 'RIO SEGUNDO', order: 2 },

  // LOS LLANOS
  { name: 'TANQUE LOS LLANOS', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACUEDUCTOALAJUELA/LOSLLANOS/TANQUE.json', type: 'tank', group: 'los-llanos', order: 1, historicoKey: 'LOSLLANOS', databaseKey: 'ACUEDUCTOALAJUELA' },
  { name: 'BOMBA LOS LLANOS', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACUEDUCTOALAJUELA/LOSLLANOS/BOMBA.json', pumpKey: 'DATABOMB', type: 'well', group: 'los-llanos', order: 2 },

  // B PRADERA (Sistema multi-bomba)
  {
    name: 'Sistema B PRADERA',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACUEDUCTOALAJUELA/BPRADERA.json',
    type: 'multi',
    group: 'b-pradera',
    order: 1,
    multiDevices: [
      { name: 'Bomba 1', type: 'well', key: 'BOMBA1' },
      { name: 'Bomba 2', type: 'well', key: 'BOMBA2' },
      { name: 'Bomba 3', type: 'well', key: 'BOMBA3' }
    ]
  }
];

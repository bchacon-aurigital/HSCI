// devicesConfig2.ts
import { Device, MultiDevice } from '../types/types';

export const devices: (Device | MultiDevice)[] = [
  { name: 'VTBLOTE 05 TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B.json', type: 'tank', group: 'vtblote-05', order: 1 },
  { name: 'Rebombeo 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA1', group: 'vtblote-05', order: 2 },
  { name: 'Rebombeo 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA2', group: 'vtblote-05', order: 3 },
  { name: 'VTBLOTE 05 TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json', type: 'tank', group: 'vtblote-05', order: 4 },
  
  // Sistema CATSA con válvulas y sensores
  { 
    name: 'Sistema de Válvulas CATSA', 
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_R.json', 
    type: 'multi', 
    group: 'catsa-valvulas', 
    order: 1,
    multiDevices: [
      { name: 'Válvula 1', type: 'valve', key: 'VAL1' },
      { name: 'Válvula 2', type: 'valve', key: 'VAL2' },
      { name: 'Válvula 3', type: 'valve', key: 'VAL3' }
    ]
  }
];

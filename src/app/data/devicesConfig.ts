// devicesConfig.ts
import { Device } from '../types/types';

export const devices: Device[] = [
  // Grupo: Vtblote 05
  { name: 'VTB CONCRETO TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC1.json', type: 'tank', group: 'Vtblote 05', order: 1 },
  { name: 'VTB CONCRETO TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC2.json', type: 'tank', group: 'Vtblote 05', order: 2 },
  { name: 'Rebombeo 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA1', group: 'Vtblote 05', order: 3 },
  { name: 'Rebombeo 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA2', group: 'Vtblote 05', order: 4 },
  { name: 'VTBLOTE 05 TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B.json', type: 'tank', group: 'Vtblote 05', order: 5 },
  { name: 'VTBLOTE 05 TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json', type: 'tank', group: 'Vtblote 05', order: 6 },
  { name: 'POZO MONTANA HE35', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/MONTANA.json', pumpKey: 'BOMBAHE35', type: 'well', group: 'Vtblote 05', order: 7 },
  { name: 'POZO MONTANA HE05', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/MONTANA.json', pumpKey: 'BOMBAHE05', type: 'well', group: 'Vtblote 05', order: 8 },

  // Grupo: Vista Sueños
  { name: 'VISTA LOS SUENOS', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLST1.json', type: 'tank', group: 'Vista Sueños', order: 1 },
  { name: 'POZO VERDE H22', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/POZOVERDE.json', pumpKey: 'BOMBAH22', type: 'well', group: 'Vista Sueños', order: 2 },
  { name: 'POZO VERDE H22J', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/POZOVERDE.json', pumpKey: 'BOMBAH22J', type: 'well', group: 'Vista Sueños', order: 3 },

  // Grupo: Vista Marina
  { name: 'VISTA LA MARINA TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT1.json', type: 'tank', group: 'Vista Marina', order: 1 },
  { name: 'VISTA LA MARINA TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT2.json', type: 'tank', group: 'Vista Marina', order: 2 },
  { name: 'POZO GEMELO H27', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/GEMELOS.json', pumpKey: 'BOMBAH27', type: 'well', group: 'Vista Marina', order: 3 },
  { name: 'POZO GEMELO H28', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/GEMELOS.json', pumpKey: 'BOMBAH28', type: 'well', group: 'Vista Marina', order: 4 }
];

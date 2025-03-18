// devicesConfig.ts
import { Device } from '../types/types';

export const devices: Device[] = [
  { name: 'VTBLOTE 05 TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B.json', type: 'tank', group: 'vtblote-05', order: 1 },
  { name: 'Rebombeo 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA1', group: 'vtblote-05', order: 2 },
  { name: 'Rebombeo 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B_VTB.json', type: 'pump', pumpKey: 'BOMBA2', group: 'vtblote-05', order: 3 },
  { name: 'VTBLOTE 05 TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json', type: 'tank', group: 'vtblote-05', order: 4 },

  { name: 'POZO MONTANA HE35', key: 'MONTANA', pumpKey: 'BOMBAHE35', type: 'well', group: 'vtblote-05', order: 5 },
  { name: 'POZO MONTANA HE05', key: 'MONTANA', pumpKey: 'BOMBAHE05', type: 'well', group: 'vtblote-05', order: 6 },
  { name: 'VTB CONCRETO TANQUE 1', key: 'VTBC1', type: 'tank', group: 'vtblote-05', order: 7 },
  { name: 'VTB CONCRETO TANQUE 2', key: 'VTBC2', type: 'tank', group: 'vtblote-05', order: 8 },

  { name: 'VISTA LOS SUENOS', key: 'VLST1', type: 'tank', group: 'vista-suenos', order: 1 },
  { name: 'POZO VERDE H22', key: 'POZOVERDE', pumpKey: 'BOMBAHE22', type: 'well', group: 'vista-suenos', order: 2 },
  { name: 'POZO VERDE H22J', key: 'POZOVERDE', pumpKey: 'BOMBAHE22J', type: 'well', group: 'vista-suenos', order: 3 },

  { name: 'VISTA LA MARINA TANQUE 1', key: 'VLMT1', type: 'tank', group: 'vista-marina', order: 1 },
  { name: 'VISTA LA MARINA TANQUE 2', key: 'VLMT2', type: 'tank', group: 'vista-marina', order: 2 },
  { name: 'POZO GEMELO H27', key: 'GEMELOS', pumpKey: 'BOMBAH27', type: 'well', group: 'vista-marina', order: 3 },
  { name: 'POZO GEMELO H28', key: 'GEMELOS', pumpKey: 'BOMBAH28', type: 'well', group: 'vista-marina', order: 4 }
];

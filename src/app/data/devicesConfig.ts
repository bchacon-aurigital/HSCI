import { Device } from '../types/types';

export const devices: Device[] = [
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
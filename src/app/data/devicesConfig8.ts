import { Device } from '../types/types';

export const devices: Device[] = [
  {
    name: 'Tanque Principal',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ZAPOTAL/TANQUE_ACERO/TANQUE.json',
    type: 'tank',
    group: 'zapotal-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'POZO-TANQUE',
    databaseKey: 'ZAPOTAL',
  },
  {
    name: 'Bomba Presión Constante 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ZAPOTAL/PRESION_CONSTANTE/BOMBA1.json',
    type: 'pump',
    group: 'zapotal-bombas',
    order: 2,
    pumpKey: 'DATABOMB',
    historicoKey: 'PC_B1',
    databaseKey: 'ZAPOTAL',
  },
  {
    name: 'Bomba Presión Constante 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ZAPOTAL/PRESION_CONSTANTE/BOMBA2.json',
    type: 'pump',
    group: 'zapotal-bombas',
    order: 3,
    pumpKey: 'DATABOMB',
    historicoKey: 'PC_B2',
    databaseKey: 'ZAPOTAL',
  },
  {
    name: 'Presión Red',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ZAPOTAL/PRESION_CONSTANTE/PRESION.json',
    type: 'pressure',
    group: 'zapotal-presion',
    order: 4,
    historicoKey: 'PRESION',
    databaseKey: 'ZAPOTAL',
  },
];

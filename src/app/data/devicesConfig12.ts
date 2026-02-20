import { Device } from '../types/types';

export const devices: Device[] = [
  // TANQUE PRINCIPAL
  {
    name: 'Tanque Principal',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/VILLA_EL_SOL/POZO_TANQUE/TANQUE.json',
    type: 'tank',
    group: 'vds-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'POZO-TANQUE',
    databaseKey: 'VILLA_EL_SOL',
  },

  // BOMBA PRESIÓN CONSTANTE 1
  {
    name: 'Bomba Presión Constante 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/VILLA_EL_SOL/PRESION_CONSTANTE/BOMBA1.json',
    type: 'pump',
    group: 'vds-presion-constante',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'PC_B1',
    databaseKey: 'VILLA_EL_SOL',
  },

  // BOMBA PRESIÓN CONSTANTE 2
  {
    name: 'Bomba Presión Constante 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/VILLA_EL_SOL/PRESION_CONSTANTE/BOMBA2.json',
    type: 'pump',
    group: 'vds-presion-constante',
    order: 2,
    pumpKey: 'DATABOMB',
    historicoKey: 'PC_B2',
    databaseKey: 'VILLA_EL_SOL',
  },

  // BOMBA PRESIÓN CONSTANTE 3
  {
    name: 'Bomba Presión Constante 3',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/VILLA_EL_SOL/PRESION_CONSTANTE/BOMBA3.json',
    type: 'pump',
    group: 'vds-presion-constante',
    order: 3,
    pumpKey: 'DATABOMB',
    historicoKey: 'PC_B3',
    databaseKey: 'VILLA_EL_SOL',
  },

  // PRESIÓN RED
  {
    name: 'Presión Red',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/VILLA_EL_SOL/PRESION_CONSTANTE/PRESION.json',
    type: 'pressure',
    group: 'vds-presion',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'PRESION',
    databaseKey: 'VILLA_EL_SOL',
    pressureRanges: {
      veryLow: 5,
      low: 10,
      normalMax: 100,
      high: 120,
    },
  },
];

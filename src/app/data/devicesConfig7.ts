import { Device, Subsystem } from '../types/types';

const nizaDevices: Device[] = [
  {
    name: 'POZO 109',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/NIZA/POZO2.json',
    type: 'well',
    group: 'niza-pozos',
    order: 2,
    pumpKey: 'DATABOMB',
    historicoKey: 'NIZA/POZO2',
    databaseKey: 'AQG',
  },
  {
    name: 'POZO 111',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/NIZA/POZO1.json',
    type: 'well',
    group: 'niza-pozos',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'NIZA/POZO1',
    databaseKey: 'AQG',
  },
  {
    name: 'Rebombeo 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/NIZA/REBOMBEO/BOMBA1.json',
    type: 'centrifugal',
    group: 'niza-rebombeo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'NIZA/REMBOMBEO1',
    databaseKey: 'AQG',
  },
  {
    name: 'Rebombeo 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/NIZA/REBOMBEO/BOMBA2.json',
    type: 'centrifugal',
    group: 'niza-rebombeo',
    order: 2,
    pumpKey: 'DATABOMB',
    historicoKey: 'NIZA/REMBOMBEO2',
    databaseKey: 'AQG',
  },
  {
    name: 'Rebombeo 3',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/NIZA/REBOMBEO/BOMBA3.json',
    type: 'centrifugal',
    group: 'niza-rebombeo',
    order: 3,
    pumpKey: 'DATABOMB',
    historicoKey: 'NIZA/REMBOMBEO3',
    databaseKey: 'AQG',
  },
  {
    name: 'Tanque Niza',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/NIZA/TANQUE.json',
    type: 'tank',
    group: 'niza-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'NIZA/TANQUE_NIZA',
    databaseKey: 'AQG',
  },
];

const caciqueDevices: Device[] = [
  {
    name: 'Pozo Cacique',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/AQG/CACIQUE/POZO.json',
    type: 'well',
    group: 'cacique-pozo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'CACIQUE/POZO',
    databaseKey: 'AQG',
  },
];

// Mantener export de devices para compatibilidad
export const devices: Device[] = [...nizaDevices, ...caciqueDevices];

export const subsystems: Subsystem[] = [
  {
    name: 'niza',
    displayName: 'Sistema Niza',
    devices: nizaDevices,
  },
  {
    name: 'cacique',
    displayName: 'Pozo Cacique',
    devices: caciqueDevices,
  },
];

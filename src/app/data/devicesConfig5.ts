// devicesConfig5.ts - Hacienda el Coyol
import { Device } from '../types/types';

export const devices: Device[] = [
  // TANQUE PRINCIPAL
  {
    name: 'TANQUE PRINCIPAL',
    key: 'POZO_TANQUE',
    pumpKey: 'TANQUE',
    type: 'tank',
    group: 'hacienda-coyol',
    order: 1,
    historicoKey: 'POZO-TANQUE',
    databaseKey: 'HACIENDA_COYOL'
  },
  
  // POZO PRINCIPAL
  {
    name: 'POZO PRINCIPAL',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/HACIENDA_COYOL/POZO_TANQUE/POZO.json',
    pumpKey: 'DATABOMB',
    type: 'centrifugal',
    group: 'hacienda-coyol',
    order: 2
  },
  
  // BOMBA PRESION CONSTANTE 1
  {
    name: 'BOMBA PRESION CONSTANTE 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/HACIENDA_COYOL/PRESION_CONSTANTE/BOMBA1.json',
    pumpKey: 'DATABOMB',
    type: 'pump',
    group: 'Red-distribucion',
    order: 3,
    historicoKey: 'PC_B1',
    databaseKey: 'HACIENDA_COYOL'
  },
  
  // BOMBA PRESION CONSTANTE 2
  {
    name: 'BOMBA PRESION CONSTANTE 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/HACIENDA_COYOL/PRESION_CONSTANTE/BOMBA2.json',
    pumpKey: 'DATABOMB',
    type: 'pump',
    group: 'Red-distribucion',
    order: 4,
    historicoKey: 'PC_B2',
    databaseKey: 'HACIENDA_COYOL'
  },
  
  // PRESION RED
  {
    name: 'PRESION RED',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/HACIENDA_COYOL/PRESION_CONSTANTE/PRESION.json',
    type: 'pressure',
    group: 'Red-distribucion',
    order: 5,
    historicoKey: 'PRESION',
    databaseKey: 'HACIENDA_COYOL'
  }
]; 
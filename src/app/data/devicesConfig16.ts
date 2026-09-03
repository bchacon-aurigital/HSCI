// devicesConfigPasoTempisque.ts - ASADA Paso Tempisque
import { Device } from '../types/types';

const pasoTempisqueHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE PRINCIPAL
  {
    name: 'Tanque Principal',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/APT/TANQUE.json',
    type: 'tank',
    group: 'apt-tanque',
    order: 1,
    pumpKey: 'NIVEL',  // IMPORTANTE: usa NIVEL en lugar de valor
    historicoKey: 'HISTORICO/TANQUE/NIVELES',
    databaseKey: 'APT',
    historicalConfig: pasoTempisqueHistoricalConfig,
  },

  // POZO 1
  {
    name: 'Pozo 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/APT/POZO.json',
    type: 'well',
    group: 'apt-pozo',
    order: 1,
    pumpKey: 'DATAPANEL',
    historicoKey: 'HISTORICO/POZO/ESTADO',
    databaseKey: 'APT',
    historicalConfig: pasoTempisqueHistoricalConfig,
  },

  // BOMBA PRESIÓN CONSTANTE 1
  {
    name: 'Bomba Presión Constante 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/APT/REBOMBEO/BOMBA1.json',
    type: 'pump',
    group: 'apt-rebombeo',
    order: 1,
    pumpKey: 'DATAPANEL',
    historicoKey: 'HISTORICO/REBOMBEO/BOMBA1/ESTADO',
    databaseKey: 'APT',
    historicalConfig: pasoTempisqueHistoricalConfig,
  },

  // BOMBA PRESIÓN CONSTANTE 2
  {
    name: 'Bomba Presión Constante 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/APT/REBOMBEO/BOMBA2.json',
    type: 'pump',
    group: 'apt-rebombeo',
    order: 2,
    pumpKey: 'DATAPANEL',
    historicoKey: 'HISTORICO/REBOMBEO/BOMBA2/ESTADO',
    databaseKey: 'APT',
    historicalConfig: pasoTempisqueHistoricalConfig,
  },

  // BOMBA PRESIÓN CONSTANTE 3
  {
    name: 'Bomba Presión Constante 3',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/APT/REBOMBEO/BOMBA3.json',
    type: 'pump',
    group: 'apt-rebombeo',
    order: 3,
    pumpKey: 'DATAPANEL',
    historicoKey: 'HISTORICO/REBOMBEO/BOMBA3/ESTADO',
    databaseKey: 'APT',
    historicalConfig: pasoTempisqueHistoricalConfig,
  },

  // PRESIÓN RED
  {
    name: 'Presión Red',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/APT/REBOMBEO.json',
    type: 'pressure',
    group: 'apt-presion',
    order: 1,
    pumpKey: 'PRESION',
    historicoKey: 'HISTORICO/REBOMBEO/PRESION',
    databaseKey: 'APT',
    historicalConfig: pasoTempisqueHistoricalConfig,
    pressureUnit: 'PSI',
    pressureRanges: {
      veryLow: 10,
      low: 20,
      normalMax: 50,
      high: 70,
    },
  },
];

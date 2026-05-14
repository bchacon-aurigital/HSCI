// devicesConfigLasDelicias.ts - ASADA Las Delicias de Nosara
import { Device } from '../types/types';

const lasDeliciasHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE GARZA - Nivel
  {
    name: 'Tanque Garza',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALDN/TANQUE_GARZA.json',
    type: 'tank',
    group: 'aldn-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'TANQUES/TANQUE_GARZA/NIVELES',
    databaseKey: 'ALDN/HISTORICO',
    historicalConfig: lasDeliciasHistoricalConfig,
  },

  // POZO 3 - Bomba
  {
    name: 'Pozo 3',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALDN/POZOS/POZO3.json',
    type: 'well',
    group: 'aldn-pozo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZOS/POZO3/ESTADOBOMBA',
    databaseKey: 'ALDN/HISTORICO/',
    historicalConfig: lasDeliciasHistoricalConfig,
  },

  // PRESION RED
  {
    name: 'Presion Red',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALDN/RED/PRESION.json',
    type: 'pressure',
    group: 'aldn-red',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'PRESION/PRESION',
    databaseKey: 'ALDN/HISTORICO',
    historicalConfig: lasDeliciasHistoricalConfig,
    pressureRanges: {
      veryLow: 5,
      low: 15,
      normalMax: 40,
      high: 50,
    },
  },
];

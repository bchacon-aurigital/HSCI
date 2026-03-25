// devicesConfig13.ts - ASADA Pablo Presbere
import { Device } from '../types/types';

const pabloPresbereHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE
  {
    name: 'Tanque Pablo Presbere',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/TANQUE.json',
    type: 'tank',
    group: 'pp-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'POZO-TANQUE/NIVELES',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // POZO 1
  {
    name: 'Pozo 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/POZOS/POZO1.json',
    type: 'well',
    group: 'pp-pozos',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZO1/ESTADOBOMBA',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // POZO 2
  {
    name: 'Pozo 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/POZOS/POZO2.json',
    type: 'well',
    group: 'pp-pozos',
    order: 2,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZO2/ESTADOBOMBA',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // POZO 3
  {
    name: 'Pozo 3',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/POZOS/POZO3.json',
    type: 'well',
    group: 'pp-pozos',
    order: 3,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZO3/ESTADOBOMBA',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // POZO 4
  {
    name: 'Pozo 4',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/POZOS/POZO4.json',
    type: 'well',
    group: 'pp-pozos',
    order: 4,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZO4/ESTADOBOMBA',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },
];

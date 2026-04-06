// devicesConfig13.ts - ASADA Pablo Presbere
import { Device } from '../types/types';

const pabloPresbereHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE 1
  {
    name: 'Tanque 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/TANQUE.json',
    type: 'tank',
    group: 'pp-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'POZO-TANQUE/NIVELES',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // TANQUE 2
  {
    name: 'Tanque 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/TANQUE2.json',
    type: 'tank',
    group: 'pp-tanque2',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'TANQUES/TANQUE2/NIVELES',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // BOMBA 1
  {
    name: 'Bomba 1',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/BOMBEO/BOMBA1.json',
    type: 'well',
    group: 'pp-bombas',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'BOMBEO/BOMBA1/ESTADO',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // BOMBA 2
  {
    name: 'Bomba 2',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/BOMBEO/BOMBA2.json',
    type: 'well',
    group: 'pp-bombas',
    order: 2,
    pumpKey: 'ESTADO',
    historicoKey: 'BOMBEO/BOMBA2/ESTADO',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // BOMBA 3
  {
    name: 'Bomba 3',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/BOMBEO/BOMBA3.json',
    type: 'well',
    group: 'pp-bombas',
    order: 3,
    pumpKey: 'ESTADO',
    historicoKey: 'BOMBEO/BOMBA3/ESTADO',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },

  // BOMBA 4
  {
    name: 'Bomba 4',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASADA_PP/BOMBEO/BOMBA4.json',
    type: 'well',
    group: 'pp-bombas',
    order: 4,
    pumpKey: 'ESTADO',
    historicoKey: 'BOMBEO/BOMBA4/ESTADO',
    databaseKey: 'ASADA_PP/HISTORICO',
    historicalConfig: pabloPresbereHistoricalConfig,
  },
];

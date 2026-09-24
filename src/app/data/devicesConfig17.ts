// devicesConfigBarcelona.ts - ASADA Barcelona
import { Device } from '../types/types';

const barcelonaHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE
  {
    name: 'Tanque Barcelona',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/BARCELONA/POZO_TANQUE/TANQUE.json',
    type: 'tank',
    group: 'barcelona-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'HISTORICO/POZO-TANQUE/NIVELES',
    databaseKey: 'BARCELONA',
    historicalConfig: barcelonaHistoricalConfig,
  },

  // POZO
  {
    name: 'Pozo Barcelona',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/BARCELONA/POZO_TANQUE/POZO.json',
    type: 'well',
    group: 'barcelona-pozo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'HISTORICO/POZO-TANQUE/ESTADOBOMBA',
    databaseKey: 'BARCELONA',
    historicalConfig: barcelonaHistoricalConfig,
  },
];

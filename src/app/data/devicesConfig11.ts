// devicesConfigCostapajaros.ts - ASADA Costa Pajaros
import { Device } from '../types/types';

const costaPajarosHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE - Nivel
  {
    name: 'Tanque',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACP/TANQUE.json',
    type: 'tank',
    group: 'costa-pajaros-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'TANQUE/NIVELES/',
    databaseKey: 'ACP/HISTORICO',
    historicalConfig: costaPajarosHistoricalConfig,
  },


  // POZO 5 - Bomba
  {
    name: 'Pozo 5',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACP/POZOS/POZO1.json',
    type: 'well',
    group: 'costa-pajaros-pozo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZO1/ESTADOBOMBA',
    databaseKey: 'ACP/HISTORICO/',
    historicalConfig: costaPajarosHistoricalConfig,
  },

  // PRESION RED
  {
    name: 'Presion Red',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ACP/RED/PRESION.json',
    type: 'pressure',
    group: 'costa-pajaros-red',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'PRESION',
    databaseKey: 'ACP/HISTORICO/PRESION',
    historicalConfig: costaPajarosHistoricalConfig,
    pressureRanges: {
      veryLow: 50,
      low: 80,
      normalMax: 110,
      high: 130,
    },
  },
];

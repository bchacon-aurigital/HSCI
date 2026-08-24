// devicesConfigSanPedroBarva.ts - ASADA San Pedro de Barva
import { Device } from '../types/types';

const sanPedroBarvaHistoricalConfig = {
  baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
  authToken: '',
  historicalDataPath: '/BASE_DATOS/',
  useSubfolders: false,
};

export const devices: Device[] = [
  // TANQUE DONA ELENA - Nivel
  {
    name: 'Tanque Dona Elena',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASPB/TANQUE.json',
    type: 'tank',
    group: 'aspb-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'HISTORICO/POZO-TANQUE/NIVELES',
    databaseKey: 'ASPB',
    historicalConfig: sanPedroBarvaHistoricalConfig,
  },

  // POZO - Bomba
  {
    name: 'Pozo Dona Elena',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASPB/BOMBA.json',
    type: 'well',
    group: 'aspb-pozo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'HISTORICO/POZO-TANQUE/POZO',
    databaseKey: 'ASPB',
    historicalConfig: sanPedroBarvaHistoricalConfig,
  },
];

import { Device, MultiDevice } from '../types/types';

const belenHistoricalConfig = {
  baseUrl: 'https://municipalidad-belen-default-rtdb.firebaseio.com',
  authToken: 'CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
  historicalDataPath: '/AGUA_POTABLE/HISTORICO/',
  useSubfolders: false,
};

export const devices: (Device | MultiDevice)[] = [
  // NACIENTE - Nivel (tank)
  {
    name: 'Naciente - Nivel',
    key: 'NACIENTE',
    pumpKey: 'NIVEL',
    type: 'tank',
    group: 'zamora-naciente',
    order: 1,
    historicoKey: 'NACIENTE/NIVEL',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // NACIENTE - Caudal LPS (valve/flow)
  {
    name: 'Caudal LPS',
    key: 'NACIENTE',
    pumpKey: 'CAUDAL_LPS',
    type: 'valve',
    group: 'zamora-naciente',
    order: 2,
    historicoKey: 'NACIENTE/CAUDAL_LPS',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // NACIENTE - Calidad OK
  {
    name: 'Calidad Agua',
    key: 'NACIENTE',
    pumpKey: 'CALIDAD_OK',
    type: 'valve',
    group: 'zamora-naciente',
    order: 3,
    historicoKey: 'NACIENTE/CALIDAD_OK',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // REBOMBEO - Bomba 1
  {
    name: 'Rebombeo Bomba 1',
    key: 'REBOMBEO',
    pumpKey: 'BOMBA1',
    type: 'pump',
    group: 'zamora-rebombeo',
    order: 1,
    historicoKey: 'REBOMBEO_B1/ESTADO',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // REBOMBEO - Bomba 2
  {
    name: 'Rebombeo Bomba 2',
    key: 'REBOMBEO',
    pumpKey: 'BOMBA2',
    type: 'pump',
    group: 'zamora-rebombeo',
    order: 2,
    historicoKey: 'REBOMBEO_B2/ESTADO',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // TANQUE PRINCIPAL - Nivel Porcentual
  {
    name: 'Tanque Principal',
    key: 'TANQUE_PRINCIPAL',
    pumpKey: 'NIVEL_PORC',
    type: 'tank',
    group: 'zamora-tanque',
    order: 1,
    historicoKey: 'TANQUE_PRINCIPAL/NIVELES',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // TANQUE PRINCIPAL - Nivel en Metros
  {
    name: 'Nivel Metros',
    key: 'TANQUE_PRINCIPAL',
    pumpKey: 'NIVEL_MTS',
    type: 'valve',
    group: 'zamora-tanque',
    order: 2,
    historicoKey: 'TANQUE_PRINCIPAL/NIVELES',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // CAUDAL SALIENTE - Caudal LPS
  {
    name: 'Caudal Saliente LPS',
    key: 'CAUDAL_SALIENTE',
    pumpKey: 'CAUDAL_LPS',
    type: 'valve',
    group: 'zamora-saliente',
    order: 1,
    historicoKey: 'CAUDAL_SALIENTE/CAUDAL',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // CAUDAL SALIENTE - Volumen M3
  {
    name: 'Volumen M3',
    key: 'CAUDAL_SALIENTE',
    pumpKey: 'VOLUMEN_M3',
    type: 'valve',
    group: 'zamora-saliente',
    order: 2,
    historicoKey: 'CAUDAL_SALIENTE/VOLUMEN',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },

  // CAUDAL SALIENTE - Presión BAR
  {
    name: 'Presión BAR',
    key: 'CAUDAL_SALIENTE',
    pumpKey: 'PRESION_BAR',
    type: 'pressure',
    group: 'zamora-saliente',
    order: 3,
    historicoKey: 'CAUDAL_SALIENTE/PRESION',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
    pressureRanges: {
      veryLow: 1.0,
      low: 1.5,
      normalMax: 3.0,
      high: 4.0,
    },
  },
];

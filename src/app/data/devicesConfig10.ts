import { Device, MultiDevice, Subsystem } from '../types/types';

const belenHistoricalConfig = {
  baseUrl: 'https://municipalidad-belen-default-rtdb.firebaseio.com',
  authToken: 'CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
  historicalDataPath: '/AGUA_POTABLE/HISTORICO/',
  useSubfolders: false,
};

const zamoraDevices: (Device | MultiDevice)[] = [
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
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_ZAMORA/REBOMBEO/BOMBA1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pump',
    group: 'zamora-rebombeo',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'REBOMBEO_B1/ESTADO',
    databaseKey: 'ZAMORA',
    historicalConfig: belenHistoricalConfig,
  },


  // REBOMBEO - Bomba 2
  {
    name: 'Rebombeo Bomba 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_ZAMORA/REBOMBEO/BOMBA2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pump',
    group: 'zamora-rebombeo',
    order: 2,
    pumpKey: 'ESTADO',
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
    historicoKey: 'CAUDAL_SALIENTE/CAUDAL',
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

const citizenDevices: (Device | MultiDevice)[] = [
  // CITIZEN - POZO NUEVO 1
  {
    name: 'Pozo Nuevo 1',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'well',
    group: 'citizen-pozos',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'POZO_NUEVO_1/ESTADO',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 2
  {
    name: 'Pozo Nuevo 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'well',
    group: 'citizen-pozos',
    order: 2,
    pumpKey: 'ESTADO',
    historicoKey: 'POZO_NUEVO_2/ESTADO',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - CAUDAL SALIENTE 1
  {
    name: 'Caudal Saliente 1',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'citizen-caudales',
    order: 1,
    pumpKey: 'PRESION_BAR',
    historicoKey: 'CAUDAL_SALIENTE_1/CAUDAL',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
    pressureRanges: {
      veryLow: 1.0,
      low: 1.5,
      normalMax: 3.0,
      high: 4.0,
    },
  },

  // CITIZEN - CAUDAL SALIENTE 2
  {
    name: 'Caudal Saliente 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'citizen-caudales',
    order: 2,
    pumpKey: 'PRESION_BAR',
    historicoKey: 'CAUDAL_SALIENTE_2/CAUDAL',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
    pressureRanges: {
      veryLow: 1.0,
      low: 1.5,
      normalMax: 3.0,
      high: 4.0,
    },
  },

  // CITIZEN - TANQUE CONCRETO
  {
    name: 'Tanque Concreto',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_CONCRETO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanques',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_CONCRETO/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 1
  {
    name: 'Tanque Elevado 1',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanques',
    order: 2,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_1/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 2
  {
    name: 'Tanque Elevado 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanques',
    order: 3,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_2/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 3
  {
    name: 'Tanque Elevado 3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_3/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanques',
    order: 4,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_3/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },
];

const epaDevices: (Device | MultiDevice)[] = [
  // EPA - POZO
  {
    name: 'Pozo',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/POZO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'well',
    group: 'epa-pozo',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'POZO/ESTADO',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 1
  {
    name: 'Tanque Elevado 1',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanques',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_1/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 2
  {
    name: 'Tanque Elevado 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanques',
    order: 2,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_2/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 3
  {
    name: 'Tanque Elevado 3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_3/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanques',
    order: 3,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_3/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 4
  {
    name: 'Tanque Elevado 4',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_4/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanques',
    order: 4,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_4/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - CAUDAL SALIENTE
  {
    name: 'Caudal Saliente',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/CAUDAL_SALIENTE/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'epa-caudal',
    order: 1,
    pumpKey: 'PRESION_RED_BAR',
    historicoKey: 'CAUDAL_SALIENTE/CAUDAL',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
    pressureRanges: {
      veryLow: 1.0,
      low: 1.5,
      normalMax: 3.0,
      high: 4.0,
    },
  },

  // EPA - PRESION SALIDA BOMBA
  {
    name: 'Presión Bombeo',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/PRESION_SALIDA_BOMBA/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'epa-caudal',
    order: 2,
    pumpKey: 'PRESION_BAR',
    historicoKey: 'PRESION_SALIDA_BOMBA/PRESION',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
    pressureRanges: {
      veryLow: 1.0,
      low: 1.5,
      normalMax: 3.0,
      high: 4.0,
    },
  },
];

export const subsystems: Subsystem[] = [
  {
    name: 'zamora',
    displayName: 'Sistema Zamora',
    devices: zamoraDevices,
  },
  {
    name: 'citizen',
    displayName: 'Sistema Citizen',
    devices: citizenDevices,
  },
  {
    name: 'epa',
    displayName: 'Sistema EPA',
    devices: epaDevices,
  },
];

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
  // CITIZEN - POZO NUEVO 1 - Estado
  {
    name: 'Pozo Nuevo 1 - Estado',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pump',
    group: 'citizen-pozo-nuevo-1',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'POZO_NUEVO_1/ESTADO',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 1 - Modo
  {
    name: 'Modo',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-1',
    order: 2,
    pumpKey: 'MODO',
    historicoKey: 'POZO_NUEVO_1/MODO',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 1 - Amps
  {
    name: 'Amps',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-1',
    order: 3,
    pumpKey: 'AMPS',
    historicoKey: 'POZO_NUEVO_1/AMPS',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 1 - Hz
  {
    name: 'Hz',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-1',
    order: 4,
    pumpKey: 'HZ',
    historicoKey: 'POZO_NUEVO_1/HZ',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 1 - VAC
  {
    name: 'VAC',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-1',
    order: 5,
    pumpKey: 'VAC',
    historicoKey: 'POZO_NUEVO_1/VAC',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 2 - Estado
  {
    name: 'Pozo Nuevo 2 - Estado',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pump',
    group: 'citizen-pozo-nuevo-2',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'POZO_NUEVO_2/ESTADO',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 2 - Modo
  {
    name: 'Modo',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-2',
    order: 2,
    pumpKey: 'MODO',
    historicoKey: 'POZO_NUEVO_2/MODO',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 2 - Amps
  {
    name: 'Amps',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-2',
    order: 3,
    pumpKey: 'AMPS',
    historicoKey: 'POZO_NUEVO_2/AMPS',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 2 - Hz
  {
    name: 'Hz',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-2',
    order: 4,
    pumpKey: 'HZ',
    historicoKey: 'POZO_NUEVO_2/HZ',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - POZO NUEVO 2 - VAC
  {
    name: 'VAC',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/POZO_NUEVO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-pozo-nuevo-2',
    order: 5,
    pumpKey: 'VAC',
    historicoKey: 'POZO_NUEVO_2/VAC',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - CAUDAL SALIENTE 1 - Caudal LPS
  {
    name: 'Caudal Saliente 1 - LPS',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-caudal-saliente-1',
    order: 1,
    pumpKey: 'CAUDAL_LPS',
    historicoKey: 'CAUDAL_SALIENTE_1/CAUDAL',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - CAUDAL SALIENTE 1 - Volumen M3
  {
    name: 'Volumen M3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-caudal-saliente-1',
    order: 2,
    pumpKey: 'VOLUMEN_M3',
    historicoKey: 'CAUDAL_SALIENTE_1/VOLUMEN',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - CAUDAL SALIENTE 1 - Presión BAR
  {
    name: 'Presión BAR',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'citizen-caudal-saliente-1',
    order: 3,
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

  // CITIZEN - CAUDAL SALIENTE 2 - Caudal LPS
  {
    name: 'Caudal Saliente 2 - LPS',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-caudal-saliente-2',
    order: 1,
    pumpKey: 'CAUDAL_LPS',
    historicoKey: 'CAUDAL_SALIENTE_2/CAUDAL',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - CAUDAL SALIENTE 2 - Volumen M3
  {
    name: 'Volumen M3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-caudal-saliente-2',
    order: 2,
    pumpKey: 'VOLUMEN_M3',
    historicoKey: 'CAUDAL_SALIENTE_2/VOLUMEN',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - CAUDAL SALIENTE 2 - Presión BAR
  {
    name: 'Presión BAR',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/CAUDAL_SALIENTE_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'citizen-caudal-saliente-2',
    order: 3,
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

  // CITIZEN - TANQUE CONCRETO - Nivel Porcentual
  {
    name: 'Tanque Concreto',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_CONCRETO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanque-concreto',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_CONCRETO/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE CONCRETO - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_CONCRETO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-tanque-concreto',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_CONCRETO/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 1 - Nivel Porcentual
  {
    name: 'Tanque Elevado 1',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanque-elevado-1',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_1/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 1 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-tanque-elevado-1',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_1/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 2 - Nivel Porcentual
  {
    name: 'Tanque Elevado 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanque-elevado-2',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_2/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 2 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-tanque-elevado-2',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_2/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 3 - Nivel Porcentual
  {
    name: 'Tanque Elevado 3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_3/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'citizen-tanque-elevado-3',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_3/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },

  // CITIZEN - TANQUE ELEVADO 3 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_CITIZEN/TANQUE_ELEVADO_3/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'citizen-tanque-elevado-3',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_3/NIVELES',
    databaseKey: 'CITIZEN',
    historicalConfig: belenHistoricalConfig,
  },
];

const epaDevices: (Device | MultiDevice)[] = [
  // EPA - POZO - Estado
  {
    name: 'Pozo - Estado',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/POZO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pump',
    group: 'epa-pozo',
    order: 1,
    pumpKey: 'ESTADO',
    historicoKey: 'POZO/ESTADO',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - POZO - Modo
  {
    name: 'Modo',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/POZO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-pozo',
    order: 2,
    pumpKey: 'MODO',
    historicoKey: 'POZO/MODO',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - POZO - Amps
  {
    name: 'Amps',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/POZO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-pozo',
    order: 3,
    pumpKey: 'AMPS',
    historicoKey: 'POZO/AMPS',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - POZO - Hz
  {
    name: 'Hz',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/POZO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-pozo',
    order: 4,
    pumpKey: 'HZ',
    historicoKey: 'POZO/HZ',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - POZO - VAC
  {
    name: 'VAC',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/POZO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-pozo',
    order: 5,
    pumpKey: 'VAC',
    historicoKey: 'POZO/VAC',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 1 - Nivel Porcentual
  {
    name: 'Tanque Elevado 1',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanque-elevado-1',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_1/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 1 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_1/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-tanque-elevado-1',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_1/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 2 - Nivel Porcentual
  {
    name: 'Tanque Elevado 2',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanque-elevado-2',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_2/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 2 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_2/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-tanque-elevado-2',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_2/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 3 - Nivel Porcentual
  {
    name: 'Tanque Elevado 3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_3/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanque-elevado-3',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_3/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 3 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_3/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-tanque-elevado-3',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_3/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 4 - Nivel Porcentual
  {
    name: 'Tanque Elevado 4',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_4/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'tank',
    group: 'epa-tanque-elevado-4',
    order: 1,
    pumpKey: 'NIVEL_PORC',
    historicoKey: 'TANQUE_ELEVADO_4/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - TANQUE ELEVADO 4 - Nivel Metros
  {
    name: 'Nivel Metros',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/TANQUE_ELEVADO_4/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-tanque-elevado-4',
    order: 2,
    pumpKey: 'NIVEL_MTS',
    historicoKey: 'TANQUE_ELEVADO_4/NIVELES',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - CAUDAL SALIENTE - Caudal LPS
  {
    name: 'Caudal Saliente - LPS',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/CAUDAL_SALIENTE/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-caudal-saliente',
    order: 1,
    pumpKey: 'CAUDAL_LPS',
    historicoKey: 'CAUDAL_SALIENTE/CAUDAL',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - CAUDAL SALIENTE - Volumen M3
  {
    name: 'Volumen M3',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/CAUDAL_SALIENTE/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'valve',
    group: 'epa-caudal-saliente',
    order: 2,
    pumpKey: 'VOLUMEN_M3',
    historicoKey: 'CAUDAL_SALIENTE/VOLUMEN',
    databaseKey: 'EPA',
    historicalConfig: belenHistoricalConfig,
  },

  // EPA - CAUDAL SALIENTE - Presión BAR
  {
    name: 'Presión BAR',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/CAUDAL_SALIENTE/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'epa-caudal-saliente',
    order: 3,
    pumpKey: 'PRESION_BAR',
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

  // EPA - PRESION BOMBEO
  {
    name: 'Presión Bombeo',
    url: 'https://municipalidad-belen-default-rtdb.firebaseio.com/AGUA_POTABLE/SISTEMA_EPA/PRESION_BOMBEO/.json?auth=CZaWf3YBN4mLOWNFp19fT5AiDZ3sVmH5fhmAEdUJ',
    type: 'pressure',
    group: 'epa-presion-bombeo',
    order: 1,
    pumpKey: 'PRESION_BAR',
    historicoKey: 'PRESION_BOMBEO/PRESION',
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

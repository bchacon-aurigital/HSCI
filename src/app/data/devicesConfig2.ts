// devicesConfig2.ts
import { Device, MultiDevice } from '../types/types';

export const devices: (Device | MultiDevice)[] = [
  { name: 'TANQUE Principal', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/TPOJO.json', pumpKey: 'valorreal', type: 'tank', group: 'ojo-de-agua-principal', order: 1, historicoKey: 'TP', databaseKey: 'ASROA'},
  { name: 'TANQUE Italticos', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ASROA/TAEREO.json', type: 'tank', group: 'ojo-de-agua-principal', order: 2, historicoKey: 'ITALTICOS', databaseKey: 'ASROA'},

  //OJO
  { name: 'TANQUE OJO DE AGUA', key: 'OJO', pumpKey: 'TANQUE', type: 'tank', group: 'ojo-de-agua', order: 1 },
  { name: 'BOMBA 1', key: 'OJO', pumpKey: 'BOMBA1', type: 'pump', group: 'ojo-de-agua', order: 2, historicoKey: 'OJO_B1', databaseKey: 'ASROA' },
  { name: 'BOMBA 2', key: 'OJO', pumpKey: 'BOMBA2', type: 'pump', group: 'ojo-de-agua', order: 3, historicoKey: 'OJO_B2', databaseKey: 'ASROA' },
  { name: 'BOMBA 3', key: 'OJO', pumpKey: 'BOMBA3', type: 'pump', group: 'ojo-de-agua', order: 4, historicoKey: 'OJO_B3', databaseKey: 'ASROA' },


  //ROD
  { name: 'TANQUE LOS RODRIGUEZ', key: 'ROD', type: 'tank', group: 'Los-rodriguez', order: 1 },
  { name: 'BOMBA DE POZO', key: 'ROD', pumpKey: 'DATAPANEL', type: 'well', group: 'Los-rodriguez', order: 2, historicoKey: 'ROD_POZO', databaseKey: 'ASROA' },

  //SACRA
  { name: 'TANQUE SACRAMENTO', key: 'SACRA', type: 'tank', group: 'Sacramento', order: 1},
  { name: 'BOMBA DE POZO', key: 'SACRA', pumpKey: 'databomb', type: 'well', group: 'Sacramento', order: 2, historicoKey: 'SACRA_POZO', databaseKey: 'ASROA' },

  //SONIA
  { name: 'TANQUE SONIA', key: 'SONIA', type: 'tank', group: 'Sonia-araujo', order: 1},
  { name: 'BOMBA DE POZO', key: 'SONIA', pumpKey: 'DATAPANEL', type: 'well', group: 'Sonia-araujo', order: 2, historicoKey: 'SONIA_POZO', databaseKey: 'ASROA' },

  //BAJOPAI
  { name: 'TANQUE BAJO PAIRE', key: 'BAJOPAI', type: 'tank', group: 'Bajo-paires', order: 1, historicoKey: 'BP', databaseKey: 'ASROA' },
  { name: 'BOMBA DE POZO', key: 'BAJOPAI', pumpKey: 'DATAPANEL', type: 'well', group: 'Bajo-paires', order: 2, historicoKey: 'BP', databaseKey: 'ASROA' },

  //JULIO
  { name: 'TANQUE JULIO ALFARO', key: 'JULIO', type: 'tank', group: 'Julio-alfaro', order: 1},
  { name: 'BOMBA DE POZO', key: 'JULIO', pumpKey: 'DATAPANEL', type: 'well', group: 'Julio-alfaro', order: 2, historicoKey: 'JULIO_POZO', databaseKey: 'ASROA' },

  //MELI
  { name: 'TANQUE LAS MELISAS', key: 'MELI', type: 'tank', group: 'Las-melisas', order: 1, historicoKey: 'MELI', databaseKey: 'ASROA' },
  { name: 'BOMBA DE POZO', key: 'MELI', pumpKey: 'DATAPANEL', type: 'well', group: 'Las-melisas', order: 2, historicoKey: 'MELI', databaseKey: 'ASROA' },

  //ZSG
  { name: 'TANQUE SAN GERARDO', key: 'ZSG', type: 'tank', group: 'San-gerardo', order: 1},
  { name: 'BOMBA DE POZO', key: 'ZSG', pumpKey: 'DATAPANEL', type: 'well', group: 'San-gerardo', order: 2, historicoKey: 'ZSG_POZO', databaseKey: 'ASROA' },

  //VICTORJ
  { name: 'TANQUE VICTOR JIMENEZ', key: 'VICTORJ', type: 'tank', group: 'Victor-jimenez', order: 1},
  { name: 'BOMBA DE POZO', key: 'VICTORJ', pumpKey: 'DATAPANEL', type: 'well', group: 'Victor-jimenez', order: 2, historicoKey: 'VICTORJ_POZO', databaseKey: 'ASROA' },

  //OCCI
  { name: 'TANQUE OCIDENTE', key: 'OCCI', type: 'tank', group: 'Occidente', order: 1},
  { name: 'BOMBA DE POZO', key: 'OCCI', pumpKey: 'DATAPANEL', type: 'well', group: 'Occidente', order: 2, historicoKey: 'OCCI_POZO', databaseKey: 'ASROA' }

];

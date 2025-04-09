// devicesConfig2.ts
import { Device, MultiDevice } from '../types/types';

export const devices: (Device | MultiDevice)[] = [
  /* { name: 'TANQUE PRINCIPAL', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/TPOJO.json', type: 'tank', group: 'ojo-de-agua', order: 1 },
   { name: 'LOS RODRIGUEZ', key: 'ROD', type: 'tank', group: 'los-rodriguez', order: 2 },
   { name: 'SACRAMENTO', key: 'SACRA', type: 'tank', group: 'sacramento', order: 3 },
   { name: 'SONIA ARAUJO', key: 'SONIA', type: 'tank', group: 'sonia-araujo', order: 4 },
   { name: 'BAJO PAIRE', key: 'BAJOPAI', type: 'tank', group: 'bajo-paires', order: 5 },
   { name: 'JULIO ALFARO', key: 'JULIO', type: 'tank', group: 'julio-alfaro', order: 6 },
   { name: 'LAS MELISAS', key: 'MELI', type: 'tank', group: 'las-melisas', order: 7 },
   { name: 'SAN GERARDO', key: 'ZSG', type: 'tank', group: 'san-gerardo', order: 8 },
   { name: 'VICTOR JIMENEZ', key: 'VICTORJ', type: 'tank', group: 'victor-jimenez', order: 9 },
   { name: 'OCIDENTE', key: 'OCCI', type: 'tank', group: 'occidente', order: 10 },
 */
  { name: 'BOMBA1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_R.json', pumpKey: 'BOMBA1', type: 'pump', group: 'catsa1', order: 1 },
  { name: 'BOMBA2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_R.json', pumpKey: 'BOMBA2', type: 'pump', group: 'catsa1', order: 2 },
  {
    name: 'Sistema de Válvulas CATSA',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_R.json',
    type: 'multi',
    group: 'catsa',
    order: 3,
    multiDevices: [
      { name: 'Válvula 1', type: 'valve', key: 'VAL1' },
      { name: 'Válvula 2', type: 'valve', key: 'VAL2' },
      { name: 'Válvula 3', type: 'valve', key: 'VAL3' }
    ]
  }
];

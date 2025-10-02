import { Device } from '../types/types';

export const devices: Device[] = [
  {
    name: 'Tanque Sanmarcanda',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/SANMARCANDA/POZO_TANQUE/TANQUE.json',
    type: 'tank',
    group: 'sanmarcanda-tanque',
    order: 1,
    pumpKey: 'valor',
    historicoKey: 'POZO-TANQUE',
    databaseKey: 'SANMARCANDA',
  },
  {
    name: 'Bomba Pozo Sanmarcanda',
    url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/SANMARCANDA/POZO_TANQUE/POZO.json',
    type: 'well',
    group: 'sanmarcanda-pozo',
    order: 1,
    pumpKey: 'DATABOMB',
    historicoKey: 'POZO-TANQUE/POZO',
    databaseKey: 'SANMARCANDA',
  },
];

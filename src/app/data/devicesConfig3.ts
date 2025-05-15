// devicesConfig2.ts
import { Device, MultiDevice } from '../types/types';

export const devices: (Device | MultiDevice)[] = [
  { name: 'TANQUE', key:'CATSA_R', type: 'tank', group: 'control1', order: 1 },
  { name: 'BOMBA1', key:'CATSA_R', pumpKey: 'BOMBA1', type: 'pump', group: 'control1', order: 1 },
  { name: 'BOMBA2', key:'CATSA_R', pumpKey: 'BOMBA2', type: 'pump', group: 'control1', order: 2 },
  {
    name: 'Sistema de Válvulas Control',
    key:'CATSA_R',
    type: 'multi',
    group: 'control',
    order: 3,
    multiDevices: [
      { name: 'Válvula 1', type: 'valve', key: 'VAL1' },
      { name: 'Válvula 2', type: 'valve', key: 'VAL2' },
      { name: 'Válvula 3', type: 'valve', key: 'VAL3' }
    ]
  }
];

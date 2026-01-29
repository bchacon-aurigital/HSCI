// dynamicDeviceLoader.ts
import { AsadaData } from '../app/types/types';

export const loadDevicesForAsada = async (codigoAsada: string): Promise<AsadaData> => {
  switch (codigoAsada) {
    // case 'codigo1':
    //   const { devices: asada1Devices } = await import('../app/data/devicesConfig');
    //   return { name: 'ASADA Los Sueños', devices: asada1Devices };
    case 'asroa2537':
      const { devices: asada2Devices } = await import('../app/data/devicesConfig2');
      return { name: 'ASADA San Rafael', devices: asada2Devices };
    case 'codigo2':
      const { devices: asada3Devices } = await import('../app/data/devicesConfig3');
      return { name: 'ASADA Control', devices: asada3Devices };
    case 'alajuela2025':
      const { devices: asada4Devices } = await import('../app/data/devicesConfig4');
      return { name: 'Acueducto Municipal Alajuela', devices: asada4Devices };
    case 'coyol2025':
      const { devices: asada5Devices } = await import('../app/data/devicesConfig5');
      return { name: 'Hacienda el Coyol', devices: asada5Devices };
    case 'catsa2025':
      const { devices: asada6Devices } = await import('../app/data/devicesConfig6');
      return { name: 'Central Azucarera del Tempisque', devices: asada6Devices };
    case 'AQG2025':
      const { subsystems: aqgSubsystems } = await import('../app/data/devicesConfig7');
      return { name: 'ASADA Quebrado Ganado', subsystems: aqgSubsystems };
    case 'zapotal2025':
      const { devices: asada8Devices } = await import('../app/data/devicesConfig8');
      return { name: 'Zapotal Beach Club', devices: asada8Devices };
    case 'sanmarcanda2025':
      const { devices: asada9Devices } = await import('../app/data/devicesConfig9');
      return { name: 'ASADA Sanmarcanda', devices: asada9Devices };
    case 'belen2025':
      const { subsystems: belenSubsystems } = await import('../app/data/devicesConfig10');
      return { name: 'Municipalidad BELEN', subsystems: belenSubsystems, headerLabel: 'Centro de Control Acueducto Municipal' };
    case 'ACP2026':
      const { devices: asada11Devices } = await import('../app/data/devicesConfig11');
      return { name: 'ASADA Costa Pajaros', devices: asada11Devices };
    default:
      throw new Error('ASADA Control');
  }
};

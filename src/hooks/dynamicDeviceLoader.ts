// dynamicDeviceLoader.ts
export const loadDevicesForAsada = async (codigoAsada: string) => {
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
    default:
      throw new Error('ASADA Control');
  }
};

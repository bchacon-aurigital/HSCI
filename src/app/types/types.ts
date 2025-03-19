export type BaseDeviceType = 'tank' | 'pump' | 'well';
export type DeviceType = BaseDeviceType | 'multi';

export interface Device {
  name: string;
  url?: string; 
  key?: string;
  type: DeviceType;
  pumpKey?: string;
  group: string;
  order: number;
}

export interface MultiDevice extends Device {
  type: 'multi';
  multiDevices: {
    name: string;
    type: 'pump' | 'well';
    pumpKey: string;
  }[];
}

export interface DeviceGroup {
  name: string;
  devices: (Device | MultiDevice)[];
}

export interface DeviceData {
  fecha: string;
  valor?: number;
  [key: string]: any;
}

export interface MultiDeviceCardProps {
  groupName: string;
  identifier: string;
  devices: {
    name: string;
    type: 'pump' | 'well';
    pumpKey: string;
  }[];
  codigoAsada?: string; 
}

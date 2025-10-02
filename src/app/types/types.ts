export type BaseDeviceType = 'tank' | 'pump' | 'well' | 'valve' | 'pressure' | 'centrifugal';
export type DeviceType = BaseDeviceType | 'multi';

export interface PressureRanges {
  veryLow: number;
  low: number;
  normalMax: number;
  high: number;
}

export interface Device {
  name: string;
  url?: string;
  key?: string;
  type: DeviceType;
  pumpKey?: string;
  group: string;
  order: number;
  historicoKey?: string;
  databaseKey?: string;
  pressureRanges?: PressureRanges;
}

export interface MultiDeviceInfo {
  name: string;
  type: BaseDeviceType;
  key: string;
  pumpKey?: string;
}

export interface MultiDevice extends Device {
  type: 'multi';
  multiDevices: MultiDeviceInfo[];
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
  devices: MultiDeviceInfo[];
  codigoAsada?: string; 
}

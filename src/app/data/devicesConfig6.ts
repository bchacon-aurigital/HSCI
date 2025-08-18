// devicesConfig6.ts - CATSA (Central Azucarera del Tempisque) - PLAYITAS
import { Device } from '../types/types';

export const devices: Device[] = [
	{
		name: 'BOMBA DEMO',
		url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_WATA/PLAYITAS/BOMBA1_DEMO.json',
		type: 'centrifugal',
		group: 'PLAYITAS',
		order: 1,
		pumpKey: 'DATABOMB',
		historicoKey: 'PLAYITAS_B1DEMO',
		databaseKey: 'CATSA_WATA',
	},
	{
		name: 'PRESION RED',
		url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/CATSA_WATA/PLAYITAS/PRESION.json',
		type: 'pressure',
		group: 'PLAYITAS',
		order: 2,
		historicoKey: 'PRESION',
		databaseKey: 'CATSA_WATA',
	},
]; 
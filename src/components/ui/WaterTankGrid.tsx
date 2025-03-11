'use client';
import WaterTankCard from './WaterTankCard';

const tanks = [
  { name: 'VTB CONCRETO TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC1.json' },
  { name: 'VTB CONCRETO TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VTBC2.json' },
  { name: 'VISTA LOS SUENOS', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLST1.json' },
  { name: 'VTBLOTE 05 TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json' },
  { name: 'VTBLOTE 05 TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3B.json' },
  { name: 'VISTA LA MARINA TANQUE 1', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT1.json' },
  { name: 'VISTA LA MARINA TANQUE 2', url: 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/VLMT2.json' }
];

export default function WaterTankGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {tanks.map((tank) => (
        <WaterTankCard key={tank.url} name={tank.name} url={tank.url} />
      ))}
    </div>
  );
}
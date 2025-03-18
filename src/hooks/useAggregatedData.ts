// useAggregatedData.ts
import { useState, useEffect } from 'react';
import { DeviceData } from '../app/types/types';

// URLs base y claves de los dispositivos agrupados
const groupedURLs: Record<string, string[]> = {
  'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSHF/.json': [
    'MONTANA', 'VTBC1', 'VTBC2', 'VLST1', 'POZOVERDE', 'VLMT1', 'VLMT2', 'GEMELOS'
  ]
};

export function useAggregatedData() {
  const [data, setData] = useState<Record<string, DeviceData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all(
          Object.entries(groupedURLs).map(async ([url, keys]) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Error de conexión');
            const result = await res.json();
            // Extraer solo los datos necesarios
            return keys.reduce((acc, key) => {
              acc[key] = result[key] as DeviceData;
              return acc;
            }, {} as Record<string, DeviceData>);
          })
        );
        // Combinar todos los resultados en un solo objeto
        setData(Object.assign({}, ...responses));
        setError(null);
      } catch (err) {
        setError('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}

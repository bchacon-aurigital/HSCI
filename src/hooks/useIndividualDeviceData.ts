// useIndividualDeviceData.ts
import { useState, useEffect } from 'react';

export function useIndividualDeviceData(url: string, pumpKey?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error de conexión');
        const result = await res.json();
        // Si se especifica pumpKey, extrae ese dato; de lo contrario, retorna el objeto completo
        const deviceData = pumpKey ? result[pumpKey] : result;
        setData(deviceData);
        setError(null);
      } catch (err) {
        setError('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, pumpKey]);

  return { data, loading, error };
}

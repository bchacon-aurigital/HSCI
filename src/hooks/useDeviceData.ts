import { useState, useEffect } from 'react';
import { DeviceData } from '../app/types/types';

export const useDeviceData = (url: string) => {
  const [data, setData] = useState<DeviceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la conexión');
        const result = await response.json();
        setData(result);
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
  }, [url]);

  return { data, error, loading };
};
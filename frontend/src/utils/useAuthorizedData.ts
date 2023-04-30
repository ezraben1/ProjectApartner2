import { useState, useEffect } from 'react';
import api from './api';


type FetchStatus = 'idle' | 'loading' | 'error';

export const useAuthorizedData = <T>(url: string | null): [T | null, FetchStatus] => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<FetchStatus>('idle');

  useEffect(() => {
    if (!url) {
      setStatus("idle");
      return;
    }
    const fetchData = async () => {
      setStatus('loading');
      try {
        const response = await api.get(url);
        const fetchedData = await response.json();
        setData(fetchedData);
        setStatus('idle');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    fetchData();
  }, [url]);

  return [data, status];
};

import { useState, useEffect } from 'react';
import { Room } from '../../types';

interface FetchRoomsResult {
  data: Room[] | null;
  loading: boolean;
  error: string | null;
}

const useFetchRooms = (url: string): FetchRoomsResult => {
    const [data, setData] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch rooms data');
        }
        const data = await response.json();
        setData(data.results);
        setLoading(false);
      } catch (error) {
        // Add a type assertion for the error object
        setError((error as Error).message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [url]);
  

  return { data, loading, error };
};

export default useFetchRooms;

import { useCallback } from 'react';
import api from '../../utils/api';

export const useDeleteImage = () => {
  const deleteImage = useCallback(async (endpoint: string, setImage: (prev: any) => any) => {
    try {
      await api.remove(endpoint);
      setImage((prev: any) => {
        if (prev) {
          const imageId = Number(endpoint.split('/').pop());
          return prev.filter((image: any) => image.id !== imageId);
        }
        return null;
      });
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error('Server error message:', (error as any).response.data);
      }

      alert('Failed to delete image.');
    }
  }, []);

  return { deleteImage };
};

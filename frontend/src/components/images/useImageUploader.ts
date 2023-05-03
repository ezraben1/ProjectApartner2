// hooks/useImageUploader.ts
import { useState } from 'react';
import api from '../../utils/api';

const useImageUploader = (
  endpoint: string,
  onSuccess: () => void,
  onError?: (error: any) => void
) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);

      try {
        setStatus('loading');
        await api.patch(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        onSuccess();
      } catch (error) {
        console.error('Error uploading image:', error);
        onError?.(error);

        if (error && (error as any).response && (error as any).response.data) {
          console.error('Server error message:', (error as any).response.data);
        }
        setStatus('error');
      } finally {
        setStatus('idle');
      }
    }
  };

  return { handleImageChange, status };
};

export default useImageUploader;

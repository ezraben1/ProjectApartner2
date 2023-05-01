import React from 'react';
import { Button } from '@chakra-ui/react';
import api from '../../utils/api';

interface DeleteFileButtonProps {
  fileType: 'bill' | 'contract';
  apiEndpoint: string;
  onDelete: () => void;
}

const DeleteFileButton: React.FC<DeleteFileButtonProps> = ({ fileType, apiEndpoint, onDelete }) => {
  const handleDelete = async () => {
    try {
      await api.remove(apiEndpoint);
      onDelete();
    } catch (error) {
      console.error(`Error deleting ${fileType} file:`, error);
    }
  };

  return (
    <Button colorScheme="red" onClick={handleDelete}>
      Delete {fileType} File
    </Button>
  );
};

export default DeleteFileButton;

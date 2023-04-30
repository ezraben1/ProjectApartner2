import React from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import { Contract } from '../../types';
import api from '../../utils/api';

interface DeleteContractProps {
  contract: Contract;
  apartmentId?: string;
  roomId?: string;
  onDelete: (deletedContract: Contract) => void; 
}

const DeleteContract: React.FC<DeleteContractProps> = ({ contract, onDelete, apartmentId, roomId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    if (!apartmentId || !roomId) {
      console.error('Apartment ID or Room ID is not defined');
      return;
    }

    try {
      const response = await api.remove(
        `/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contract.id}/`
      );
      if (response.status === 204) {
        onDelete(contract);
        onClose();
      } else {
        throw new Error('Error deleting contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Contract
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Contract
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this contract? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteContract;

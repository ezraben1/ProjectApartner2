import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import api from '../../utils/api';
import { Apartment } from '../../types';

interface UpdateApartmentFormProps {
  apartment: Apartment;
  onUpdate: (updatedApartment: Apartment) => void;
}

const UpdateApartmentForm: React.FC<UpdateApartmentFormProps> = ({
  apartment,
  onUpdate,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/owner/owner-apartments/${apartment.id}/`, {
        address,
        description,
        size,
      });

      setAddress('');
      setDescription('');
      setSize('');
      toast({
        title: 'Apartment updated.',
        description: 'The apartment has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating apartment:', error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error('Server error message:', (error as any).response.data);
      }

      toast({
        title: 'Error updating apartment.',
        description: 'There was an error updating the apartment. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <>
      <Button colorScheme="yellow" onClick={onOpen}>
        Update Apartment
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Apartment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="address">
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>

            <FormControl id="description" mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl id="size" mt={4}>
              <FormLabel>Size</FormLabel>
              <Input
                type="number"
                placeholder="Enter size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateApartmentForm;

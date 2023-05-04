import React, { useState } from 'react';
import { Room } from '../../types';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import api from '../../utils/api';

interface UpdateRoomFormProps {
  room: Room;
  onUpdate: (updatedRoom: Room) => void;
  apartmentId: number;

}

const UpdateRoomForm: React.FC<UpdateRoomFormProps> = ({ room,apartmentId, onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updatedRoom, setUpdatedRoom] = useState<Room>(room);
  const [renterSearch, setRenterSearch] = useState('');

  const toast = useToast();

  const handleRenterSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRenterSearch(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedRoom((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setUpdatedRoom((prevState) => ({ ...prevState, window: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     try {
      const response = await api.patch(`/owner/owner-apartments/${apartmentId}/room/${room.id}/`, {
        ...updatedRoom,
        renter_search: renterSearch,
        apartment_id: apartmentId,
      });
      const data = await response.json();
      onUpdate(data);
      toast({
        title: 'Room updated.',
        description: 'The room has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating room:', error);
      toast({
        title: 'Error updating room.',
        description: 'There was an error updating the room. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };
  
  

  return (
    <>
      <Button onClick={onOpen} colorScheme="yellow">
        Update Room
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={updatedRoom.description || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Renter Search</FormLabel>
              <Input
                name="renter_search"
                value={renterSearch}
                onChange={handleRenterSearchChange}
                placeholder="Search for renter users"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Size</FormLabel>
              <Input
                name="size"
                type="number"
                value={updatedRoom.size}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price per month</FormLabel>
              <Input
                name="price_per_month"
                type="number"
                value={updatedRoom.price_per_month}
                onChange={handleChange}
              />
            </FormControl>
            <Checkbox
              name="window"
              isChecked={updatedRoom.window}
              onChange={handleCheckboxChange}
              mt={4}
            >
              Has window
            </Checkbox>
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

export default UpdateRoomForm

import React, { useState } from 'react';
import { Contract } from '../../types';
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
  useDisclosure,
} from '@chakra-ui/react';
import api from '../../utils/api';

interface UpdateContractFormProps {
  contract: Contract;
  onUpdate: (updatedContract: Contract) => void;
  apartmentId?: string;
  roomId?: string;
}

const UpdateContractForm: React.FC<UpdateContractFormProps> = ({ contract, onUpdate, apartmentId, roomId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updatedContract, setUpdatedContract] = useState<Contract>(contract);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedContract((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apartmentId || !roomId) {
      console.error('Apartment ID or Room ID is not defined');
      return;
    }
  
    try {
      const response = await api.patch(`/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contract.id}/`, updatedContract);

      if (response.status === 200) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        onClose();
      } else {
        throw new Error('Error updating contract');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="yellow">
        Update Contract
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Contract</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                name="start_date"
                type="date"
                value={updatedContract.start_date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End Date</FormLabel>
              <Input
                name="end_date"
                type="date"
                value={updatedContract.end_date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Deposit Amount</FormLabel>
              <Input
                name="deposit_amount"
                type="number"
                value={updatedContract.deposit_amount}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Rent Amount</FormLabel>
              <Input
                name="rent_amount"
                type="number"
                value={updatedContract.rent_amount}
                onChange={handleChange}
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

export default UpdateContractForm;

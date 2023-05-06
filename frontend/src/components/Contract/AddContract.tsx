import React, { useState } from "react";
import { Apartment, Contract } from "../../types";
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
} from "@chakra-ui/react";
import api from "../../utils/api";

interface AddContractProps {
  onCreate: (createdContract: Contract) => void;
  roomId: number;
  apartmentId: number | Apartment;
}

const AddContract: React.FC<AddContractProps> = ({
  roomId,
  apartmentId,
  onCreate,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newContract, setNewContract] = useState<Partial<Contract>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContract((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/`,
        newContract
      );

      if (response.status === 201) {
        const createdData = await response.json();
        onCreate(createdData);
        onClose();
      } else {
        throw new Error("Error creating contract");
      }
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add Contract
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new contract</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="start_date">
              <FormLabel>Start Date</FormLabel>
              <Input type="date" name="start_date" onChange={handleChange} />
            </FormControl>
            <FormControl id="end_date">
              <FormLabel>End Date</FormLabel>
              <Input type="date" name="end_date" onChange={handleChange} />
            </FormControl>
            <FormControl id="deposit_amount">
              <FormLabel>Deposit Amount</FormLabel>
              <Input
                type="number"
                name="deposit_amount"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="rent_amount">
              <FormLabel>Rent Amount</FormLabel>
              <Input type="number" name="rent_amount" onChange={handleChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddContract;

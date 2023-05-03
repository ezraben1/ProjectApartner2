import { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import api from '../../utils/api';

const AddApartmentForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/owner/owner-apartments/', {
        address,
        description,
        size,
      });

      setAddress('');
      setDescription('');
      setSize('');
      alert('Apartment added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding apartment:', error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error('Server error message:', (error as any).response.data);
      }

      alert('Failed to add apartment.');
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Add Apartment</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Apartment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Size</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </FormControl>

              <Button colorScheme="black" mt={4} type="submit">
                Add Apartment
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddApartmentForm;

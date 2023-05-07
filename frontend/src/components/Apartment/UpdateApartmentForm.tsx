import React, { useState } from "react";
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
  Checkbox,
} from "@chakra-ui/react";
import api from "../../utils/api";
import { Apartment } from "../../types";

interface UpdateApartmentFormProps {
  apartment: Apartment;
  onUpdate: (updatedApartment: Apartment) => void;
}

const UpdateApartmentForm: React.FC<UpdateApartmentFormProps> = ({
  apartment,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [city, setCity] = useState(apartment.city);
  const [street, setStreet] = useState(apartment.street);
  const [buildingNumber, setBuildingNumber] = useState(
    apartment.building_number
  );
  const [apartmentNumber, setApartmentNumber] = useState(
    apartment.apartment_number
  );
  const [floor, setFloor] = useState(apartment.floor);
  const [description, setDescription] = useState(apartment.description);
  const [size, setSize] = useState(apartment.size);
  const [balcony, setBalcony] = useState(!!apartment.balcony);
  const [bbqAllowed, setBbqAllowed] = useState(apartment.bbq_allowed);
  const [smokingAllowed, setSmokingAllowed] = useState(
    apartment.smoking_allowed
  );
  const [allowedPets, setAllowedPets] = useState(apartment.allowed_pets);
  const [ac, setAc] = useState(apartment.ac);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/owner/owner-apartments/${apartment.id}/`, {
        city,
        street,
        building_number: buildingNumber,
        apartment_number: apartmentNumber,
        floor,
        description,
        size,
        balcony,
        bbq_allowed: bbqAllowed,
        smoking_allowed: smokingAllowed,
        allowed_pets: allowedPets,
        ac,
      });
      setCity("");
      setStreet("");
      setBuildingNumber("");
      setApartmentNumber("");
      setFloor("");
      setDescription("");
      setSize("");
      setBalcony(false);
      setBbqAllowed(false);
      setSmokingAllowed(false);
      setAllowedPets(false);
      setAc(false);

      toast({
        title: "Apartment updated.",
        description: "The apartment has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating apartment:", error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error("Server error message:", (error as any).response.data);
      }

      toast({
        title: "Error updating apartment.",
        description:
          "There was an error updating the apartment. Please try again later.",
        status: "error",
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
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Street</FormLabel>
              <Input
                type="text"
                placeholder="Enter street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Building Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter building number"
                value={buildingNumber}
                onChange={(e) => setBuildingNumber(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Apartment Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter apartment number"
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Floor</FormLabel>
              <Input
                type="text"
                placeholder="Enter floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
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

            <FormControl id="balcony" mt={4}>
              <Checkbox
                isChecked={balcony}
                onChange={(e) => setBalcony(e.target.checked)}
              >
                Balcony
              </Checkbox>
            </FormControl>

            <FormControl id="bbqAllowed" mt={4}>
              <Checkbox
                isChecked={bbqAllowed}
                onChange={(e) => setBbqAllowed(e.target.checked)}
              >
                BBQ allowed
              </Checkbox>
            </FormControl>

            <FormControl id="smokingAllowed" mt={4}>
              <Checkbox
                isChecked={smokingAllowed}
                onChange={(e) => setSmokingAllowed(e.target.checked)}
              >
                Smoking allowed
              </Checkbox>
            </FormControl>

            <FormControl id="allowedPets" mt={4}>
              <Checkbox
                isChecked={allowedPets}
                onChange={(e) => setAllowedPets(e.target.checked)}
              >
                Allowed pets
              </Checkbox>
            </FormControl>

            <FormControl id="ac" mt={4}>
              <Checkbox
                isChecked={ac}
                onChange={(e) => setAc(e.target.checked)}
              >
                Air conditioning
              </Checkbox>
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

import { useState } from "react";
import {
  Button,
  Checkbox,
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
} from "@chakra-ui/react";
import api from "../../utils/api";

const AddApartmentForm: React.FC = () => {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [balcony, setBalcony] = useState(false);
  const [bbqAllowed, setBbqAllowed] = useState(false);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [allowedPets, setAllowedPets] = useState(false);
  const [ac, setAc] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/owner/owner-apartments/", {
        city,
        street,
        building_number: buildingNumber,
        apartment_number: apartmentNumber,
        floor,
        description,
        size,
        balcony: balcony,
        bbq_allowed: bbqAllowed,
        smoking_allowed: smokingAllowed,
        allowed_pets: allowedPets,
        ac: ac,
      });

      setCity("");
      setStreet("");
      setBuildingNumber("");
      setApartmentNumber("");
      setFloor("");
      setDescription("");
      setSize("");
      alert("Apartment added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding apartment:", error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error("Server error message:", (error as any).response.data);
      }

      alert("Failed to add apartment.");
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
              <FormControl mt={4}>
                <FormLabel>Balcony</FormLabel>
                <Checkbox
                  isChecked={balcony}
                  onChange={(e) => setBalcony(e.target.checked)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>BBQ Allowed</FormLabel>
                <Checkbox
                  isChecked={bbqAllowed}
                  onChange={(e) => setBbqAllowed(e.target.checked)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Smoking Allowed</FormLabel>
                <Checkbox
                  isChecked={smokingAllowed}
                  onChange={(e) => setSmokingAllowed(e.target.checked)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Allowed Pets</FormLabel>
                <Checkbox
                  isChecked={allowedPets}
                  onChange={(e) => setAllowedPets(e.target.checked)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>AC</FormLabel>
                <Checkbox
                  isChecked={ac}
                  onChange={(e) => setAc(e.target.checked)}
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

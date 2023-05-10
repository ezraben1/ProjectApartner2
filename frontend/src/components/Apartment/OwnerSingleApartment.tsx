import { useEffect, useState } from "react";
import { Apartment, Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  List,
  ListItem,
  Button,
  Heading,
  Text,
  Flex,
  Box,
  VStack,
  Input,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import UpdateApartmentForm from "./UpdateApartmentForm";
import DeleteApartment from "./DeleteApartment";
import AddRoomForm from "../Room/AddRoomForm";
import api from "../../utils/api";
import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import ApartmentThumbnail from "../images/ApartmentThumbnail";

interface ImageItem {
  id: number;
  original: string;
  thumbnail: string;
  renderItem: () => JSX.Element;
}

const SingleApartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [apartmentData, status] = useAuthorizedData<Apartment>(
    `/owner/owner-apartments/${id}/`
  );

  useEffect(() => {
    if (status === "idle" && apartmentData) {
      setApartment(apartmentData);
    }
  }, [apartmentData, status]);

  // Add state for image file
  const [] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      try {
        await api.patch(
          `/owner/owner-apartments/${apartmentData?.id}/upload_image/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);

        if (error && (error as any).response && (error as any).response.data) {
          console.error("Server error message:", (error as any).response.data);
        }

        alert("Failed to upload image.");
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.remove(
        `/owner/owner-apartments/${apartmentData?.id}/images/${imageId}/`
      );
      setApartment((prev) => {
        if (prev) {
          return {
            ...prev,
            images: prev.images.filter((image) => image.id !== imageId),
          };
        }
        return null;
      });
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error("Server error message:", (error as any).response.data);
      }

      alert("Failed to delete image.");
    }
  };

  const updateApartment = (updatedApartment: Apartment) => {
    setApartment(updatedApartment);
  };
  const [] = useState(false);

  const imageItems = apartment?.images.map((image) => ({
    id: image.id,
    original: image.image,
    thumbnail: image.image,
    renderItem: () => (
      <Box onClick={() => handleDeleteImage(image.id)} cursor="pointer">
        <img
          src={image.image}
          alt="Apartment"
          style={{ objectFit: "contain" }}
        />
      </Box>
    ),
  }));

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageNext = () => {
    if (imageItems) {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % imageItems.length);
    }
  };

  const handleImagePrev = () => {
    if (imageItems) {
      setSelectedImageIndex(
        (prevIndex) => (prevIndex - 1 + imageItems.length) % imageItems.length
      );
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !apartment) {
    return <div>Error loading apartment data.</div>;
  }

  return (
    <Box
      maxW="1000px"
      mx="auto"
      p="6"
      bg="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex justify="center" align="center">
        <Heading>{apartment.address}</Heading>
      </Flex>
      <VStack align="stretch" spacing={6}>
        <Flex justify="center" align="center" mt={4}>
          {imageItems && imageItems.length > 0 && (
            <>
              <IconButton
                aria-label="Previous image"
                icon={<ChevronLeftIcon />}
                onClick={handleImagePrev}
                isDisabled={imageItems.length <= 1}
                colorScheme="gray"
                variant="outline"
                size="sm"
              />

              <Box maxW="100%" h="450px" borderRadius="lg" overflow="hidden">
                <Image
                  src={(imageItems[selectedImageIndex] as ImageItem).original}
                  alt={(imageItems[selectedImageIndex] as ImageItem).original}
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>

              <IconButton
                aria-label="Next image"
                icon={<ChevronRightIcon />}
                onClick={handleImageNext}
                isDisabled={imageItems.length <= 1}
                colorScheme="gray"
                variant="outline"
                size="sm"
              />

              <IconButton
                aria-label="Delete image"
                icon={<DeleteIcon />}
                onClick={() =>
                  handleDeleteImage(
                    (imageItems[selectedImageIndex] as ImageItem).id
                  )
                }
                colorScheme="red"
                variant="outline"
                ml={2}
                size="sm"
              />
            </>
          )}
        </Flex>

        <StatGroup width="100%" justifyContent="space-around" mt={4}>
          <Stat>
            <StatLabel fontSize="md">Size</StatLabel>
            <StatNumber fontSize="sm">{apartment.size} sqm </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Balcony</StatLabel>
            <StatNumber fontSize="sm">
              {apartment.balcony ? "Yes" : "No"}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Smoking</StatLabel>
            <StatNumber fontSize="sm">
              {apartment.smoking_allowed ? "Yes" : "No"}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Pets</StatLabel>
            <StatNumber fontSize="sm">
              {apartment.allowed_pets ? "Yes" : "No"}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">AC</StatLabel>
            <StatNumber fontSize="sm">{apartment.ac ? "Yes" : "No"}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">BBQ</StatLabel>
            <StatNumber fontSize="sm">
              {apartment.bbq_allowed ? "Yes" : "No"}
            </StatNumber>
          </Stat>
        </StatGroup>
        <Flex direction="column" alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Upload Images:
          </Text>
          <InputGroup>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <InputRightElement>
              <IconButton aria-label="Upload" icon={<AddIcon />} />
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Flex>
          <UpdateApartmentForm
            apartment={apartment}
            onUpdate={updateApartment}
          />
          <Box ml={30}>
            <DeleteApartment apartmentId={id} />
          </Box>
        </Flex>
        <Text fontSize="lg" color="gray.600">
          {apartment.description}
        </Text>

        {/* Add image gallery using react-image-gallery */}

        <Box>
          <Heading size="md" mb={2}>
            Rooms
          </Heading>
          <List spacing={3}>
            {apartment.rooms?.map((room: Room) => (
              <Link
                key={room.id}
                to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}
              >
                <ListItem
                  p="4"
                  rounded="md"
                  bg="gray.50"
                  boxShadow="md"
                  transition="background 0.2s"
                  _hover={{
                    bg: "gray.100",
                  }}
                >
                  <Heading as="h1" size="xl" textAlign="center" my={8}>
                    Room #{room.id}
                  </Heading>
                  <Flex align="center" justify="center" mb={8}>
                    <ApartmentThumbnail src={room.images?.[0]?.image || ""} />
                  </Flex>
                  <VStack spacing={2} alignItems="start">
                    <Text fontWeight="bold">Price per month:</Text>
                    <Text>{room.price_per_month}</Text>
                    <Text fontWeight="bold">Size:</Text>
                    <Text>{room.size}</Text>
                  </VStack>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>

        <Flex justify="space-between" align="center">
          <AddRoomForm apartmentId={apartment.id} />
          <Flex>
            <Link
              to={`/owner/my-apartments/${apartment.id}/contracts?apartmentId=${apartment.id}`}
            >
              <Button colorScheme="green">View Contracts</Button>
            </Link>
            <Link to={`/owner/my-apartments/${apartment.id}/bills`}>
              <Button colorScheme="blue" ml={2}>
                View Bills
              </Button>
            </Link>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default SingleApartment;

import { useEffect, useState } from "react";
import { Room, CustomUser, Contract, RoomImage } from "../../types";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
  Input,
  Flex,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  StatGroup,
  StatLabel,
  StatNumber,
  Stat,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import UpdateRoomForm from "./UpdateRoomForm";
import DeleteRoom from "./DeleteRoom";
import { useNavigate } from "react-router-dom";
import AddContract from "../Contract/AddContract";
import api from "../../utils/api";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { deleteImage } from "../images/imageUtils";

const OwnerSingleRoom: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [renter, setRenter] = useState<CustomUser | null>(null);
  const [apartmentId, setApartmentId] = useState<number>(0);
  const [, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const handleRoomDelete = () => {
    navigate(-1);
  };

  const handleContractCreate = (createdContract: Contract) => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        return { ...prevRoom, contract: createdContract };
      }
      return prevRoom;
    });
  };

  useEffect(() => {
    const fetchApartmentAndRoomIds = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/owner/owner-apartments/${id}/room/${id}/`
        );
        const roomData = await response.json();

        setRoom(roomData);
        setRenter(roomData.renter);
        setApartmentId(roomData.apartment_id);
      } catch (error) {
        console.error("Error fetching apartment and room IDs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartmentAndRoomIds();
  }, [id]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      try {
        await api.patch(
          `/owner/owner-rooms/${room?.id}/upload_image/`,
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

  const handleDeleteImage = (imageId: number) => {
    const endpoint = `/owner/owner-rooms/${room?.id}/images/${imageId}/`;
    deleteImage(
      endpoint,
      (id) => {
        setRoom((prev) => {
          if (prev) {
            return {
              ...prev,
              images: prev.images.filter((image: RoomImage) => image.id !== id),
            };
          }
          return null;
        });
      },
      imageId
    );
  };

  const imageItems = room?.images.map((image) => ({
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

  if (status === "error" || !room) {
    return <div>Error loading room data.</div>;
  }

  return (
    <Box bg="white" borderRadius="md" boxShadow="xl" p={8}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Room #{room.id}
      </Heading>

      <Flex align="center" justify="center" mb={4}>
        {room.images && room.images.length > 0 && (
          <>
            <IconButton
              aria-label="Previous image"
              icon={<ChevronLeftIcon />}
              onClick={handleImagePrev}
              isDisabled={room.images.length <= 1}
              colorScheme="gray"
              variant="outline"
            />
            {room.images.map((image, index) => (
              <Box
                key={index}
                borderRadius="sm"
                overflow="hidden"
                display={selectedImageIndex === index ? "block" : "none"}
              >
                <Image
                  src={image.image}
                  alt={`Room ${room.id} image ${index}`}
                  objectFit="contain"
                  boxSize={{ base: "350px", md: "lg", lg: "xl" }}
                />
              </Box>
            ))}
            <IconButton
              aria-label="Next image"
              icon={<ChevronRightIcon />}
              onClick={handleImageNext}
              isDisabled={room.images.length <= 1}
              colorScheme="gray"
              variant="outline"
            />
            <IconButton
              aria-label="Delete image"
              icon={<DeleteIcon />}
              onClick={() =>
                handleDeleteImage(room.images[selectedImageIndex].id)
              }
              colorScheme="red"
              variant="outline"
              ml={2}
            />
          </>
        )}
      </Flex>
      <VStack spacing={4} align="start" width="100%">
        <StatGroup width="100%" justifyContent="space-around" mt={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Description
          </Text>
          <Text textAlign="center">{room.description}</Text>
        </StatGroup>

        <StatGroup width="100%" justifyContent="space-around" mt={4}>
          <Stat>
            <StatLabel fontSize="md">Size</StatLabel>
            <StatNumber fontSize="sm">{room.size} sqm</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Price per month</StatLabel>
            <StatNumber fontSize="sm">${room.price_per_month}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Has window</StatLabel>
            <StatNumber fontSize="sm">{room.window ? "Yes" : "No"}</StatNumber>
          </Stat>
        </StatGroup>
        {room.contract ? (
          <Box>
            <Text>
              <strong>Contract ID:</strong> {room.contract.id}
            </Text>
            <Link
              to={`/owner/my-apartments/${apartmentId}/room/${room.id}/contracts/${room.contract.id}`}
            >
              <Button colorScheme="blue">Room Contract</Button>
            </Link>
          </Box>
        ) : (
          <Text>No contract available for this room.</Text>
        )}

        {renter ? (
          <Box>
            <Text>
              <strong>Renter name:</strong> {renter.first_name}{" "}
              {renter.last_name}
            </Text>
            <Text>
              <strong>email:</strong> {renter.email}
            </Text>
            <Image
              src={renter.avatar}
              alt="Renter's avatar"
              width="50px"
              height="50px"
            />
          </Box>
        ) : (
          <Text>No renter assigned to this room.</Text>
        )}
      </VStack>
      <Flex justifyContent="center">
        <HStack
          spacing={{ base: 2, md: 4 }}
          justifyContent="space-between"
          flexWrap={{ base: "wrap", md: "nowrap" }}
          mt={{ base: 4, md: 6 }}
        >
          <Box flex="1">
            <UpdateRoomForm
              room={room}
              apartmentId={apartmentId}
              onUpdate={(updatedRoom: Room) => setRoom(updatedRoom)}
            />
          </Box>
          <Box flex="1">
            <DeleteRoom
              roomId={room.id}
              apartmentId={apartmentId}
              onDelete={handleRoomDelete}
            />
          </Box>
          <Box flex="1">
            <AddContract
              roomId={room.id}
              apartmentId={apartmentId}
              onCreate={handleContractCreate}
            />
          </Box>
          <Box flex={{ base: "1", md: "0" }} mt={{ base: 4, md: 0 }}>
            <Flex
              direction="column"
              alignItems={{ base: "center", md: "flex-start" }}
            >
              <Text
                fontSize={{ base: "sm", md: "lg" }}
                fontWeight="bold"
                mb={2}
              >
                Upload Images:
              </Text>
              <InputGroup>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <InputRightElement>
                  <IconButton aria-label="Upload" icon={<AddIcon />} />
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default OwnerSingleRoom;

import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { List, ListItem, Button, Heading, Text, Flex, Box, VStack, Input, IconButton, Image, Stack } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import UpdateApartmentForm from './UpdateApartmentForm';
import DeleteApartment from './DeleteApartment';
import AddRoomForm from '../Room/AddRoomForm';
import api from '../../utils/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const SingleApartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [apartmentData, status] = useAuthorizedData<Apartment>(`/owner/owner-apartments/${id}/`);

  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartment(apartmentData);
    }
  }, [apartmentData, status]);

  // Add state for image file
  const [, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      try {
        await api.patch(`/owner/owner-apartments/${apartmentData?.id}/upload_image/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);

        if (error && (error as any).response && (error as any).response.data) {
          console.error('Server error message:', (error as any).response.data);
        }

        alert('Failed to upload image.');
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.remove(`/owner/owner-apartments/${apartmentData?.id}/images/${imageId}/`);
      setApartment((prev) => {
        if (prev) {
          return {
            ...prev,
            images: prev.images.filter((image) => image.id !== imageId),
          };
        }
        return null;
      });
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error('Server error message:', (error as any).response.data);
      }

      alert('Failed to delete image.');
    }
  };

  const updateApartment = (updatedApartment: Apartment) => {
    setApartment(updatedApartment);
  };
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const imageItems = apartment?.images.map((image) => ({
    original: image.image,
    thumbnail: image.image,
    renderItem: () => (
      <Box onClick={() => handleDeleteImage(image.id)} cursor="pointer">
        <img src={image.image} alt="Apartment" style={{ objectFit: 'contain' }} />
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
      setSelectedImageIndex((prevIndex) => (prevIndex - 1 + imageItems.length) % imageItems.length);
    }
  };

  

  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !apartment) {
    return <div>Error loading apartment data.</div>;
  }




  return (
    <Box maxW="800px" mx="auto" p="6" bg="white" borderRadius="lg" boxShadow="md">
      <VStack align="stretch" spacing={6}>
        <Flex justify="center" align="center" >
        <Flex align="center" justify="center">
          {imageItems && imageItems.length > 0 && (
            <>
              <IconButton
                aria-label="Previous image"
                icon={<ChevronLeftIcon />}
                onClick={handleImagePrev}
                isDisabled={imageItems.length <= 1}
                colorScheme="gray"
                variant="outline"
              />
              <Box boxSize="300px" borderRadius="sm" overflow="hidden" >
                <Image
                  src={imageItems[selectedImageIndex].original}
                  alt={imageItems[selectedImageIndex].original}
                  objectFit="contain"
                />
              </Box>
              <IconButton
                aria-label="Next image"
                icon={<ChevronRightIcon />}
                onClick={handleImageNext}
                isDisabled={imageItems.length <= 1}
                colorScheme="gray"
                variant="outline"
              />
            </>
          )}
        </Flex>
            <Heading>{apartment.address}</Heading>
          </Flex>
          <Flex>
          <UpdateApartmentForm apartment={apartment} onUpdate={updateApartment} />
          <Box  ml={30}>
            <DeleteApartment apartmentId={id} />
          </Box>
        </Flex>
        <Text fontSize="lg" color="gray.600">{apartment.description}</Text>

        {/* Add image upload input */}
        <Stack direction="column" spacing={3}>
          <Text fontWeight="bold">Upload Images:</Text>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </Stack>

        {/* Add image gallery using react-image-gallery */}

        <Box>
          <Heading size="md" mb={2}>Rooms</Heading>
          <List spacing={3}>
            {apartment.rooms?.map((room: Room) => (
              <Link key={room.id} to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}>
                <ListItem
                  p="4"
                  rounded="md"
                  bg="gray.50"
                  boxShadow="md"
                  transition="background 0.2s"
                  _hover={{
                    bg: 'gray.100',
                  }}
                  >
                    <Heading size="md">{room.description}</Heading>
                    <Text fontWeight="bold">Price per month:</Text>
                    <Text>{room.price_per_month}</Text>
                    <Text fontWeight="bold">Size:</Text>
                    <Text>{room.size}</Text>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
  
          <Flex justify="space-between" align="center">
            <AddRoomForm apartmentId={apartment.id} />
            <Flex>
              <Link to={`/owner/my-apartments/${apartment.id}/contracts`}>
                <Button colorScheme="green">View Contracts</Button>
              </Link>
              <Link to={`/owner/my-apartments/${apartment.id}/bills`}>
                <Button colorScheme="blue" ml={2}>View Bills</Button>
              </Link>
            </Flex>
          </Flex>
        </VStack>
      </Box>
    );
  };
  
  export default SingleApartment;
  
import { useEffect, useState } from 'react';
import { Room, CustomUser, Contract, RoomImage } from '../../types';
import { useParams, Link } from 'react-router-dom';
import { Box, Heading, VStack, Text, Button, HStack, Input, Flex, IconButton,Image, InputGroup, InputRightElement, StatGroup, StatLabel, StatNumber, Stat, Center  } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import UpdateRoomForm from './UpdateRoomForm';
import DeleteRoom from './DeleteRoom';
import { useNavigate } from 'react-router-dom';
import AddContract from '../Contract/AddContract';
import api from '../../utils/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const OwnerSingleRoom: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
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
        const response = await api.get(`/owner/owner-apartments/${id}/room/${id}/`);
        const roomData = await response.json();
        
        setRoom(roomData);
        setApartmentId(roomData.apartment_id);
      } catch (error) {
        console.error('Error fetching apartment and room IDs:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApartmentAndRoomIds();
  }, [id]);
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      try {
        await api.patch(`/owner/owner-rooms/${room?.id}/upload_image/`, formData, {
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
      await api.remove(`/owner/owner-rooms/${room?.id}/images/${imageId}/`);
      setRoom((prev) => {
        if (prev) {
          return {
            ...prev,
            images: prev.images.filter((image: RoomImage) => image.id !== imageId),
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

  const imageItems = room?.images.map((image) => ({
    original: image.image,
    thumbnail: image.image,
    renderItem: () => (
      <Box onClick={() => handleDeleteImage(image.id)} cursor="pointer">
        <img src={image.image} alt="Apartment" style={{ objectFit: 'contain' }} />
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
      setSelectedImageIndex((prevIndex) => (prevIndex - 1 + imageItems.length) % imageItems.length);
    }
  };
  
  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !room) {
    return <div>Error loading room data.</div>;
  }

  return (
    
    <Box>
       <Heading as="h1" size="xl" textAlign="center" my={8}>
    Room #{room.id}
  </Heading>
  
  {/* Add image gallery */}
  <Flex align="center" justify="center" mt={4}>
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
            display={selectedImageIndex === index ? 'block' : 'none'}
          >
            <Image
              src={image.image}
              alt={`Room ${room.id} image ${index}`}
              objectFit="contain"
              boxSize="lg" // Increase the size of the image here
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
      </>
    )}
    
  </Flex>

  <VStack spacing={4} align="start" width="100%">
  <Center bg=''>
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      Description
    </Text>
  </Center>
  <Text textAlign="center">{room.description}</Text>

  <StatGroup width="100%" justifyContent="space-around" mt={4}>
    <Stat>
      <StatLabel>Size</StatLabel>
      <StatNumber>{room.size}</StatNumber>
    </Stat>
    <Stat>
      <StatLabel>Price per month</StatLabel>
      <StatNumber>{room.price_per_month}</StatNumber>
    </Stat>
    <Stat>
      <StatLabel>Has window</StatLabel>
      <StatNumber>{room.window ? 'Yes' : 'No'}</StatNumber>
    </Stat>
  </StatGroup>


  {room.contract ? (
    <Box>
      <Text>
        <strong>Contract ID:</strong> {room.contract.id}
      </Text>
      <Link to={`/owner/my-apartments/${apartmentId}/room/${room.id}/contracts/${room.contract.id}`}>
        <Button colorScheme="blue">Room Contract</Button>
      </Link>
    </Box>
  ) : (
    <Text>No contract available for this room.</Text>
  )}

  {renter ? (
    <Box>
      <Text>
        <strong>Renter ID:</strong> {renter.id}
      </Text>
      <Text>
        <strong>Renter name:</strong> {renter.first_name} {renter.last_name}
      </Text>
    </Box>
  ) : (
    <Text>No renter assigned to this room.</Text>
  )}
</VStack>
      <HStack spacing={4} mt={6}>
      <UpdateRoomForm room={room} apartmentId={apartmentId} onUpdate={(updatedRoom: Room) => setRoom(updatedRoom)} />
        <DeleteRoom roomId={room.id} apartmentId={apartmentId} onDelete={handleRoomDelete} />
        <AddContract roomId={room.id} apartmentId={apartmentId} onCreate={handleContractCreate} />
        <Flex direction="column" alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold" mb={2}>Upload Images:</Text>
          <InputGroup>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        <InputRightElement>
          <IconButton aria-label="Upload" icon={<AddIcon />} />
        </InputRightElement>
      </InputGroup>
    </Flex>

      </HStack>
    </Box>
  );
};

export default OwnerSingleRoom;

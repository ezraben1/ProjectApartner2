import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { useUserType } from '../../utils/useUserType';
import { VStack, Button, Heading, Text, Box, List, ListItem, Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AddApartmentForm from './AddApartmentForm';
import RoomThumbnail from '../images/RoomThumbnail';

const ApartmentThumbnail: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Image
      src={src}
      alt="Apartment thumbnail"
      width="150px"
      height="150px"
      objectFit="cover"
      borderRadius="md"
    />
  );
};

const MyApartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [apartmentData, status] = useAuthorizedData<Apartment[]>('/owner/owner-apartments/');
  const { userType, status: userTypeStatus } = useUserType();


  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartments(apartmentData);
    }
  }, [apartmentData, status]);

  if (status === 'loading' || userTypeStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === 'error' || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== 'owner') {
    return <div>You are not an owner!</div>;
  }

  if (status === 'error' || !apartments) {
    return <div>Error loading apartment data.</div>;
  }

  return (
    <Box maxW="800px" mx="auto" p="6">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>My Apartments</Heading>
        <AddApartmentForm />
      </Flex>

      <List spacing={4}>
        {apartments.map((apartment: Apartment) => (
          <Link to={`/owner/my-apartments/${apartment.id}`}>
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
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{apartment.address}</Heading>
                  <Text fontSize="lg" color="red.500">{apartment.address}</Text>
                  <ApartmentThumbnail src={apartment.images?.[0]?.image || ''} />

                </Flex>
                <Text>{apartment.description}</Text>
                <List spacing={3}>
                {apartment.rooms?.map((room: Room) => (
                    <Link key={room.id} to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}>
                      <ListItem
                          p="4"
                          rounded="md"
                          bg="gray.100"
                          boxShadow="md"
                          transition="background 0.2s"
                          _hover={{
                            bg: 'gray.200',
                          }}
                        >
                          <Flex align="center">
                            <RoomThumbnail src={room.images[0]?.image || ''} />
                            <VStack align="start" spacing={2} marginLeft="16px">
                              <Heading size="sm">{room.description}</Heading>
                              <Text>Price per month: {room.price_per_month}</Text>
                              <Text>Size: {room.size}</Text>
                            </VStack>
                          </Flex>
                        </ListItem>
                    </Link>
                  ))}
                </List>
                <Flex justify="space-between" align="center">
                <Button as={Link} to={`/owner/my-apartments/${apartment.id}/contracts?apartmentId=${apartment.id}`} colorScheme="blue">
                View Contracts
                </Button>                  
                <Link to={`/owner/my-apartments/${apartment.id}/bills`}>
                <Button colorScheme="green" ml={2}>View Bills</Button>
                </Link>
                </Flex>
              </VStack>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default MyApartments;

import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { useUserType } from '../../utils/useUserType';
import { VStack, Button, Heading, Text, Box, List, ListItem, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AddApartmentForm from './AddApartmentForm';

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
          <Link key={apartment.id} to={`/owner/my-apartments/${apartment.id}`}>
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
                </Flex>
                <Text>{apartment.description}</Text>
                <List spacing={3}>
                  {apartment.rooms.map((room: Room) => (
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
                        <Heading size="sm">{room.description}</Heading>
                        <Text>Price per month: {room.price_per_month}</Text>
                        <Text>Size: {room.size}</Text>
                      </ListItem>
                    </Link>
                  ))}
                </List>
                <Flex justify="space-between" align="center">
                  <Button as={Link} to={`/owner/my-apartments/${apartment.id}/contracts`} colorScheme="blue">View Contracts</Button>
                  <Link to={`/owner/my-apartments/${apartment.id}/add-bill`}>
                    <Button colorScheme="green">Add Bill</Button>
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

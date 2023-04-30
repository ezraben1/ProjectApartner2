import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { List, ListItem, Button, Heading, Text, Flex, Box, VStack } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import UpdateApartmentForm from './UpdateApartmentForm';
import DeleteApartment from './DeleteApartment';
import AddRoomForm from '../Room/AddRoomForm';

const SingleApartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [apartmentData, status] = useAuthorizedData<Apartment>(`/owner/owner-apartments/${id}/`);

  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartment(apartmentData);
    }
  }, [apartmentData, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !apartment) {
    return <div>Error loading apartment data.</div>;
  }

  const updateApartment = (updatedApartment: Apartment) => {
    setApartment(updatedApartment);
  };

  return (
    <Box maxW="800px" mx="auto" p="6" bg="white" borderRadius="lg" boxShadow="md">
      <VStack align="stretch" spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading>{apartment.address}</Heading>
          <Flex>
            <UpdateApartmentForm apartment={apartment} onUpdate={updateApartment} />
            <DeleteApartment apartmentId={id} />
          </Flex>
        </Flex>
        <Text>{apartment.description}</Text>
        <List spacing={3}>
          {apartment.rooms.map((room: Room) => (
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
                <Text>Price per month: {room.price_per_month}</Text>
                <Text>Size: {room.size}</Text>
              </ListItem>
            </Link>
          ))}
        </List>
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

import { useEffect, useState } from 'react';
import { Room, CustomUser } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { useParams, Link } from 'react-router-dom';
import { Box, Heading, VStack, Text, Button, HStack } from '@chakra-ui/react';
import UpdateRoomForm from './UpdateRoomForm';
import DeleteRoom from './DeleteRoom';
import { useNavigate } from 'react-router-dom';

const OwnerSingleRoom: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [renter, setRenter] = useState<CustomUser | null>(null);
  const [roomData, status] = useAuthorizedData<Room>(`/owner/owner-apartments/${id}/room/${id}/`);
  
  
  const navigate = useNavigate();

  const handleRoomDelete = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (status === 'idle' && roomData) {
      setRoom(roomData);

      if (roomData.renter) {
        // Make a new request to fetch the renter object
        fetch(`/renters/${roomData.renter}`)
          .then(response => response.json())
          .then(renterData => setRenter(renterData))
          .catch(error => console.log(error));
      }
    }
  }, [roomData, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !room) {
    return <div>Error loading room data.</div>;
  }
  console.log("room object:", room);

  return (
    <Box>
      <Heading as="h1" size="xl" textAlign="center" my={8}>
        Room #{room.id}
      </Heading>
      <VStack spacing={3} align="start">
        <Text>
          <strong>Description:</strong> {room.description}
        </Text>
        <Text>
          <strong>Size:</strong> {room.size}
        </Text>
        <Text>
          <strong>Price per month:</strong> {room.price_per_month}
        </Text>
        <Text>
          <strong>Has window:</strong> {room.window ? 'Yes' : 'No'}
        </Text>
        {room.contract ? (
          <Box>
            <Text>
              <strong>Contract ID:</strong> {room.contract.id}
            </Text>
            <Link   to={`/owner/owner-apartments/${room.apartment.id}/room/${room.id}/contracts/${room.contract.id}`}>
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
        <UpdateRoomForm room={room} onUpdate={(updatedRoom: Room) => setRoom(updatedRoom)} />
        <DeleteRoom roomId={id} onDelete={handleRoomDelete} />
      </HStack>
    </Box>
  );
};

export default OwnerSingleRoom;

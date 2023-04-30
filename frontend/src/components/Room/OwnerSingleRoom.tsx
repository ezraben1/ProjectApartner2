import { useEffect, useState } from 'react';
import { Room, CustomUser, Contract } from '../../types';
import { useParams, Link } from 'react-router-dom';
import { Box, Heading, VStack, Text, Button, HStack } from '@chakra-ui/react';
import UpdateRoomForm from './UpdateRoomForm';
import DeleteRoom from './DeleteRoom';
import { useNavigate } from 'react-router-dom';
import AddContract from '../Contract/AddContract';
import api from '../../utils/api';

const OwnerSingleRoom: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
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
            
            <Link   to={`/owner/my-apartments/${apartmentId}/room/${room.id}/contracts/${room.contract.id}`}>
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

      </HStack>
    </Box>
  );
};

export default OwnerSingleRoom;

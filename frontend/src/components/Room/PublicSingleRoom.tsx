import { useEffect, useState } from 'react';
import { Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { useParams } from 'react-router-dom';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';

const PublicSingleRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomData, status] = useAuthorizedData<Room>(`core/feed/${id}/`);

  useEffect(() => {
    if (status === 'idle' && roomData) {
      setRoom(roomData);
    }
  }, [roomData, status]);

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
      </VStack>
    </Box>
  );
};

export default PublicSingleRoom;


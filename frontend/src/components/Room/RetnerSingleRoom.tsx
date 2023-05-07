import { useEffect, useState } from "react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  Heading,
  Text,
  Flex,
  Box,
  VStack,
  Image,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Room } from "../../types";
import { fetchUserId } from "../../utils/userId";

const RenterSingleRoom: React.FC = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [roomData, status] = useAuthorizedData<Room>(`/renter/my-room/`);
  const [, setLoading] = useState(true);
  const [renterId, setRenterId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const id = await fetchUserId();
      setRenterId(id);
      setUserLoading(false);
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (renterId) {
      console.log("renter ID:", renterId);
    }
  }, [renterId]);

  useEffect(() => {
    if (status === "idle" && roomData) {
      setRoom(roomData);
      setLoading(false);
    }
  }, [roomData, status]);

  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  if (!renterId) {
    return <div>Error fetching renter ID.</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !room) {
    return <div>Error loading room data.</div>;
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
        <Heading>{`${room.size} Room in ${room.city}, ${room.street} ${room.building_number}`}</Heading>
      </Flex>
      <VStack align="stretch" spacing={6}>
        <Flex justify="center" align="center" mt={4}>
          {room.images && room.images.length > 0 && (
            <Box maxW="100%" h="450px" borderRadius="lg" overflow="hidden">
              <Image
                src={room.images[0].image}
                alt="Room"
                objectFit="contain"
                w="100%"
                h="100%"
              />
            </Box>
          )}
        </Flex>
        <StatGroup width="100%" justifyContent="space-around" mt={4}>
          <Stat>
            <StatLabel fontSize="md">Size</StatLabel>
            <StatNumber fontSize="sm">{room.size} </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Price per Month</StatLabel>
            <StatNumber fontSize="sm">${room.price_per_month}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Window</StatLabel>
            <StatNumber fontSize="sm">{room.window ? "Yes" : "No"}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Description</StatLabel>
            <StatNumber fontSize="sm">{room.description}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Contract Start Date</StatLabel>
            <StatNumber fontSize="sm">
              {room.contract ? room.contract.start_date : "N/A"}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md">Contract End Date</StatLabel>
            <StatNumber fontSize="sm">
              {room.contract ? room.contract.end_date : "N/A"}
            </StatNumber>
          </Stat>
        </StatGroup>
        <Text fontSize="lg" color="gray.600">
          {room.description}
        </Text>
        <Link to={`/renter/my-bills/`}>
          <Button colorScheme="blue">View Bills</Button>
        </Link>
        <Link to={`/renter/my-room/${room.id}/contracts/${room.contract.id}`}>
          <Button colorScheme="blue">View contract</Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default RenterSingleRoom;

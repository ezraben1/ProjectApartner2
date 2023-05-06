import React from "react";
import { Link } from "react-router-dom";
import { Room } from "../../types";
import RoomThumbnail from "../images/RoomThumbnail";
import {
  Box,
  Heading,
  List,
  ListItem,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";

interface RoomListProps {
  rooms: Room[] | null;
  apartmentId: number | null;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, apartmentId }) => {
  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Rooms
      </Heading>
      <List spacing={4}>
        {rooms?.map((room) => (
          <Link
            key={room.id}
            to={`/owner/my-apartments/${apartmentId}/room/${room.id}`}
          >
            <ListItem
              p="4"
              rounded="md"
              bg="gray.50"
              boxShadow="md"
              transition="background 0.2s"
              _hover={{
                bg: "gray.100",
              }}
            >
              <Flex align="center" justify="space-between">
                <RoomThumbnail src={room.images[0]?.image || ""} />
                <VStack align="start" spacing={2} flex="1" marginLeft="16px">
                  <Text fontSize="md" fontWeight="bold">
                    Size: {room.size}
                  </Text>
                  <Text fontSize="md">
                    Price per month: {room.price_per_month}
                  </Text>
                  <Text fontSize="md">
                    Window: {room.window ? "Yes" : "No"}
                  </Text>
                </VStack>
              </Flex>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default RoomList;

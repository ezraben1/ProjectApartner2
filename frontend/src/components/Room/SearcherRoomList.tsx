import React from "react";
import { Link } from "react-router-dom";
import { Room } from "../../types";
import {
  Box,
  Heading,
  List,
  ListItem,
  VStack,
  Text,
  Flex,
  HStack,
  Image,
} from "@chakra-ui/react";

interface RoomListProps {
  rooms: Room[] | null;
  apartmentId: number | null;
}

const SearcherRoomList: React.FC<RoomListProps> = ({ rooms }) => {
  return (
    <Box pt={8}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Available Rooms
      </Heading>

      <List spacing={4}>
        {rooms?.map((room) => (
          <Link key={room.id} to={`/searcher/searcher-search/${room.id}`}>
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
              <Flex
                direction={{ base: "column", md: "row" }}
                w="100%"
                wrap="wrap"
              >
                <Box
                  boxSize={{ base: "100%", md: "200px" }}
                  mr={{ base: 0, md: 4 }}
                  mb={{ base: 4, md: 0 }}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Image
                    src={room.images[0]?.image}
                    alt="Room thumbnail"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <HStack
                  spacing={8}
                  align="start"
                  flex={{ base: "none", md: "1" }}
                >
                  <VStack align="start" spacing={2} flex="1">
                    <Text fontSize="md" fontWeight="bold">
                      Room Details
                    </Text>
                    <Text fontSize="md">
                      Description:{" "}
                      {room.description
                        ? room.description.split(" ").slice(0, 8).join(" ") +
                          "..."
                        : "N/A"}
                    </Text>
                    <Text fontSize="md">Size: {room.size} sqm</Text>
                    <Text fontSize="md">Price: {room.price_per_month} $</Text>
                    <Text fontSize="md">
                      Window: {room.window ? "Yes" : "No"}
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={2} flex="1">
                    <Text fontSize="md" fontWeight="bold">
                      Apartment Details
                    </Text>
                    <Text fontSize="md">Address: {room.apartment.address}</Text>
                    <Text fontSize="md">
                      Balcony: {room.apartment.balcony ? "Yes" : "No"}
                    </Text>
                    <Text fontSize="md">
                      BBQ: {room.apartment.bbq_allowed ? "Yes" : "No"}
                    </Text>
                    <Text fontSize="md">
                      Smoking: {room.apartment.smoking_allowed ? "Yes" : "No"}
                    </Text>
                    <Text fontSize="md">
                      Pets: {room.apartment.allowed_pets ? "Yes" : "No"}
                    </Text>
                    <Text fontSize="md">Size: {room.apartment.size} sqm</Text>
                    <Text fontSize="md">
                      AC: {room.apartment.ac ? "Yes" : "No"}
                    </Text>
                  </VStack>
                </HStack>
              </Flex>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default SearcherRoomList;

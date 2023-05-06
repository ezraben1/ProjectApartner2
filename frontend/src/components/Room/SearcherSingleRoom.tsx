import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  VStack,
  Text,
  Button,
  Image,
  HStack,
  Heading,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import ImageGallery from "../images/ImageGallery";

const SearcherSingleRoom = () => {
  const { roomId } = useParams();
  const [roomData, status] = useAuthorizedData<Room | null>(
    `/searcher/searcher-search/${roomId}/`
  );

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (status === "error") {
    return <Text>Error fetching room data.</Text>;
  }

  if (!roomData) {
    return <Text>No data available.</Text>;
  }

  const { description, size, price_per_month, window, images, apartment } =
    roomData;

  return (
    <Flex
      justify="center"
      align="center"
      w="100%"
      minH="calc(100vh - 6rem)"
      bg="gray.100"
    >
      <Box maxW="60rem" w="100%" p={4}>
        <Stack spacing={8}>
          <Heading as="h1" size="2xl">
            Room Details
          </Heading>
          <ImageGallery images={images} />
          <Stack align="start" spacing={4}>
            <Stack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                Description
              </Text>
              <Text fontSize="md">{description}</Text>
            </Stack>
            <Stack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                Room Details
              </Text>
              <Flex justify="space-between">
                <Stack spacing={2}>
                  <Text fontSize="md">Size</Text>
                  <Text fontSize="md">{size} sqm</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Price</Text>
                  <Text fontSize="md">{price_per_month} $</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Window</Text>
                  <Text fontSize="md">{window ? "Yes" : "No"}</Text>
                </Stack>
              </Flex>
            </Stack>
            <Stack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                Apartment Details
              </Text>
              <Stack spacing={2}>
                <Text fontSize="md">Address</Text>
                <Text fontSize="md">{apartment.address}</Text>
              </Stack>
              <Flex justify="space-between">
                <Stack spacing={2}>
                  <Text fontSize="md">Balcony</Text>
                  <Text fontSize="md">{apartment.balcony ? "Yes" : "No"}</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">BBQ</Text>
                  <Text fontSize="md">
                    {apartment.bbq_allowed ? "Yes" : "No"}
                  </Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Smoking</Text>
                  <Text fontSize="md">
                    {apartment.smoking_allowed ? "Yes" : "No"}
                  </Text>
                </Stack>
              </Flex>
              <Flex justify="space-between">
                <Stack spacing={2}>
                  <Text fontSize="md">Pets</Text>
                  <Text fontSize="md">
                    {apartment.allowed_pets ? "Yes" : "No"}
                  </Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Size</Text>
                  <Text fontSize="md">{apartment.size} sqm</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">AC</Text>
                  <Text fontSize="md"> {apartment.ac ? "Yes" : "No"}</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Allowed Pets</Text>
                  <Text fontSize="md">
                    {" "}
                    {apartment.allowed_pets ? "Yes" : "No"}
                  </Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Smoking Allowed</Text>
                  <Text fontSize="md">
                    {" "}
                    {apartment.smoking_allowed ? "Yes" : "No"}
                  </Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">BBQ Allowed</Text>
                  <Text fontSize="md">
                    {" "}
                    {apartment.bbq_allowed ? "Yes" : "No"}
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Stack>
        <HStack mt={6} spacing={6}>
          <Button
            colorScheme="blue"
            onClick={() => console.log("Send Inquiry")}
          >
            Send Inquiry
          </Button>
          <Button
            colorScheme="green"
            onClick={() => console.log("Show Contract")}
          >
            Show Contract
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => console.log("Sign Contract")}
          >
            Sign Contract
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default SearcherSingleRoom;

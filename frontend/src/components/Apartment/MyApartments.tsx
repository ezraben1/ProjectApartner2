import { useEffect, useState } from "react";
import { Apartment, Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useUserType } from "../../utils/useUserType";
import {
  VStack,
  Button,
  Heading,
  Text,
  Box,
  List,
  ListItem,
  Flex,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AddApartmentForm from "./AddApartmentForm";
import RoomThumbnail from "../images/RoomThumbnail";

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
  const [apartmentData, status] = useAuthorizedData<Apartment[]>(
    "/owner/owner-apartments/"
  );
  const { userType, status: userTypeStatus } = useUserType();

  useEffect(() => {
    if (status === "idle" && apartmentData) {
      setApartments(apartmentData);
    }
  }, [apartmentData, status]);

  if (status === "loading" || userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "owner") {
    return <div>You are not an owner!</div>;
  }

  if (status === "error" || !apartments) {
    return <div>Error loading apartment data.</div>;
  }
  return (
    <Box maxW="1200px" mx="auto" p="6">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb={{ base: 6, md: 0 }}
      >
        <Heading>My Apartments</Heading>
        <AddApartmentForm />
      </Flex>

      <List spacing={6}>
        {apartments.map((apartment: Apartment) => (
          <Link to={`/owner/my-apartments/${apartment.id}`} key={apartment.id}>
            <ListItem
              p={{ base: 4, md: 6 }}
              rounded="md"
              bg="white"
              boxShadow="md"
              transition="all 0.2s"
              _hover={{
                bg: "gray.50",
                transform: "translateY(-4px)",
                boxShadow: "xl",
              }}
              maxW={{ base: "full", md: "800px" }}
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="center"
              >
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.800">
                    {apartment.address}
                  </Heading>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color="red.500"
                    fontWeight="semibold"
                  >
                    {apartment.rooms?.length} Rooms
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
                    {apartment.description}
                  </Text>
                </VStack>
                <ApartmentThumbnail src={apartment.images?.[0]?.image || ""} />
              </Flex>
              <List spacing={4} mt={4}>
                {apartment.rooms?.map((room: Room) => (
                  <Link
                    key={room.id}
                    to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}
                  >
                    <ListItem
                      p={{ base: 2, md: 4 }}
                      rounded="md"
                      bg="gray.50"
                      boxShadow="md"
                      transition="all 0.2s"
                      _hover={{
                        bg: "gray.100",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                    >
                      <Flex align="center">
                        <RoomThumbnail src={room.images[0]?.image || ""} />
                        <VStack
                          align="start"
                          spacing={2}
                          ml={{ base: 2, md: 4 }}
                        >
                          <Heading size="sm" color="gray.800">
                            {room.description}
                          </Heading>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            color="gray.500"
                          >
                            Price per month: {room.price_per_month}
                          </Text>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            color="gray.500"
                          >
                            Size: {room.size}
                          </Text>
                        </VStack>
                      </Flex>
                    </ListItem>
                  </Link>
                ))}
              </List>
              <Flex justify="flex-end" align="center" mt={4}>
                <Button
                  as={Link}
                  to={`/owner/my-apartments/${apartment.id}/contracts?apartmentId=${apartment.id}`}
                  colorScheme="blue"
                  size={{ base: "xs", md: "sm" }}
                  mr={2}
                >
                  View Contracts
                </Button>
                <Link to={`/owner/my-apartments/${apartment.id}/bills`}>
                  <Button colorScheme="green" size={{ base: "xs", md: "sm" }}>
                    View Bills
                  </Button>
                </Link>
              </Flex>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default MyApartments;

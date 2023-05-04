import { useEffect, useState } from 'react';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { Heading, Text, Flex, Box, VStack, Image, StatGroup, Stat, StatLabel, StatNumber, Button } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import InquiryForm from '../Inquiry/InquiryForm';
import api from '../../utils/api';

interface ApartmentAPI {
  id: number;
  owner_id: number;
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string | null;
  address: string;
  description: string;
  size: string;
  balcony: boolean;
  bbq_allowed: boolean;
  smoking_allowed: boolean;
  allowed_pets: boolean;
  ac: boolean;
  images: Array<any>;
}

const RenterSingleApartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<ApartmentAPI | null>(null);
  const [apartmentData, status] = useAuthorizedData<ApartmentAPI>(`/renter/my-apartment/${id}`);
  const [loading, setLoading] = useState(true);
  const [renterId, setRenterId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get('/core/me/');
        const data = await response.json();
        if (data && data.length > 0) {
          setRenterId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (renterId) {
      console.log('renter ID:', renterId);
    }
  }, [renterId]);

  

  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartment(apartmentData);
      setLoading(false);
    }
  }, [apartmentData, status]);

  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  if (!renterId) {
    return <div>Error fetching renter ID.</div>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !apartment) {
    return <div>Error loading apartment data.</div>;
  }


  return (
    <Box maxW="1000px" mx="auto" p="6" bg="white" borderRadius="lg" boxShadow="md">
      <Flex justify="center" align="center">
        <Heading>{apartment.address}</Heading>
      </Flex>
      <VStack align="stretch" spacing={6}>
      
        <Flex justify="center" align="center" mt={4}>
          {apartment.images && apartment.images.length > 0 && (
            <Box maxW="100%" h="450px" borderRadius="lg" overflow="hidden" >
              <Image
                src={apartment.images[0].image}
                alt="Apartment"
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
                    <StatNumber fontSize="sm">{apartment.size} sqm </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="md">Balcony</StatLabel>
                    <StatNumber fontSize="sm">{apartment.balcony ? 'Yes' : 'No'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="md">Smoking</StatLabel>
                    <StatNumber fontSize="sm">{apartment.smoking_allowed ? 'Yes' : 'No'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="md">Pets</StatLabel>
                    <StatNumber fontSize="sm">{apartment.allowed_pets ? 'Yes' : 'No'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="md">AC</StatLabel>
                    <StatNumber fontSize="sm">{apartment.ac ? 'Yes' : 'No'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="md">BBQ</StatLabel>
                    <StatNumber fontSize="sm">{apartment.bbq_allowed ? 'Yes' : 'No'}</StatNumber>
                  </Stat>
                </StatGroup>
        <Text fontSize="lg" color="gray.600">{apartment.description}</Text>
        <Link to={`/renter/my-apartment/${apartment.id}/bills`}>
          <Button colorScheme="blue">View Bills</Button>
        </Link>
        <Text fontSize="lg" color="gray.600">
          Owner: {apartment.owner_first_name} {apartment.owner_last_name} ({apartment.owner_email})
        </Text>
        <Text fontSize="lg" color="gray.600">
          Phone: {apartment.owner_phone}
        </Text>
      {apartment && renterId !== null && (
  <InquiryForm
    url={`/renter/my-apartment/${apartment.id}/inquiries/`}
    sender={renterId}
    receiver={apartment.owner_id}
  />
)}

      </VStack>
    </Box>
  );
};

export default RenterSingleApartment;

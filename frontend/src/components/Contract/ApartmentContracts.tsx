import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, HStack, Text, Link } from "@chakra-ui/react";
import { Contract } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Link as RouterLink, useLocation } from "react-router-dom";
import queryString from "query-string";
import DeleteContract from "./DeleteContract";

interface RouteParams {
  [key: string]: string | undefined;
  apartmentId: string;
  roomId: string;
}

const ApartmentContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const { search } = useLocation();
  const { apartmentId } = queryString.parse(search) as RouteParams;
  const [contractData, status] = useAuthorizedData<Contract[]>(
    `/owner/owner-apartments/${apartmentId}/contracts/`
  );

  useEffect(() => {
    if (status === "idle" && contractData) {
      setContracts(contractData);
    }
  }, [contractData, status, apartmentId]);

  const handleContractDelete = (deletedContract: Contract) => {
    setContracts((prevContracts) =>
      prevContracts.filter((contract) => contract.id !== deletedContract.id)
    );
  };

  return (
    <Box>
      <Heading mb={4}>Apartment {apartmentId} Contracts</Heading>
      {contracts.length > 0 ? (
        <VStack spacing={4} align="start">
          {contracts.map((contract: Contract) => (
            <Box key={contract.id} borderWidth={1} borderRadius="md" p={4}>
              <Link
                as={RouterLink}
                to={`/owner/my-apartments/${contract.apartment_id}/room/${contract.room_id}/contracts/${contract.id}`}
              >
                <HStack spacing={4}>
                  <Text>Contract #{contract.id}</Text>
                  <Text>Start Date: {contract.start_date}</Text>
                  <Text>End Date: {contract.end_date}</Text>
                  <Text>Deposit Amount: {contract.deposit_amount}</Text>
                  <Text>Rent Amount: {contract.rent_amount}</Text>
                </HStack>
              </Link>
              <DeleteContract
                contract={contract}
                onDelete={handleContractDelete}
                apartmentId={apartmentId}
                roomId={contract.room_id.toString()}
              />
            </Box>
          ))}
        </VStack>
      ) : (
        <Box>No contracts found for this apartment.</Box>
      )}
    </Box>
  );
};

export default ApartmentContracts;

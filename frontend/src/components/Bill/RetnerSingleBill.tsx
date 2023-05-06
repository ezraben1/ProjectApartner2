import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bill } from "../../types";
import api from "../../utils/api";
import {
  VStack,
  Heading,
  Text,
  Box,
  Button,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from "@chakra-ui/react";
import { handleDownloadFile } from "../images/handleDownloadFile";

const RenterSingleBill: React.FC = () => {
  const { billId } = useParams<{
    apartmentId?: string;
    billId?: string;
  }>();
  const [bill, setBill] = useState<Bill | null>(null);

  const fetchBill = async () => {
    try {
      const response = await api.get(`/renter/my-bills/${billId}/`);
      const data = await response.json();
      setBill(data);
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [billId]);

  const handleDownload = () => {
    handleDownloadFile(
      `/renter/my-bills/${billId}/download/`,
      billId || "",
      bill?.bill_type || "bill"
    );
  };

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <Box maxW="800px" mx="auto" p="6">
      <VStack align="start" spacing={4}>
        <Heading>{bill.bill_type}</Heading>
        <StatGroup width="100%" justifyContent="space-around" mt={4}>
          <Stat>
            <StatLabel fontSize="md" textAlign="center">
              Amount
            </StatLabel>
            <StatNumber fontSize="sm" textAlign="center">
              ${bill.amount}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="md" textAlign="center">
              Date:
            </StatLabel>
            <StatNumber fontSize="sm" textAlign="center">
              {bill.date}
            </StatNumber>
          </Stat>
        </StatGroup>

        <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={6}>
          {bill.file ? (
            <Button colorScheme="blue" onClick={handleDownload}>
              Download File
            </Button>
          ) : (
            <Text>No file uploaded</Text>
          )}
        </Stack>
      </VStack>
    </Box>
  );
};

export default RenterSingleBill;

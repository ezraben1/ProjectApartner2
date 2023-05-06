// InquiryList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import api from "../../utils/api";
import { Inquiry } from "../../types";

const InquiryList: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await api.get("/core/inquiries/");
        const data = await response.json();
        setInquiries(data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <VStack spacing={6} align="stretch">
      <Heading>Inquiries</Heading>
      {inquiries.map((inquiry) => (
        <Link key={inquiry.id} to={`/inquiries/${inquiry.id}`}>
          <Box
            p={4}
            borderWidth={1}
            borderRadius="lg"
            _hover={{ bg: "gray.50", cursor: "pointer" }}
          >
            {inquiry.image && (
              <img src={inquiry.image} alt="Inquiry" width="100" height="100" />
            )}

            <Text fontWeight="bold">Status: {inquiry.status}</Text>
            <Text fontWeight="bold" mt={2}>
              Apartment: {inquiry.apartment.address}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Sender: {inquiry.sender.first_name} {inquiry.sender.last_name}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Receiver:{" "}
              {inquiry.receiver
                ? `${inquiry.receiver.first_name} ${inquiry.receiver.last_name}`
                : "N/A"}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Type: {inquiry.type}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Message: {inquiry.message}
            </Text>
          </Box>
        </Link>
      ))}
    </VStack>
  );
};

export default InquiryList;

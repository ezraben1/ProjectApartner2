// InquiryList.tsx
import { Box, VStack, Text } from "@chakra-ui/react";
import { Inquiry } from "../../types";
import { Link } from "react-router-dom";

interface InquiryListProps {
  inquiries: Inquiry[];
}

const InquiryList: React.FC<InquiryListProps> = ({ inquiries }) => {
  return (
    <VStack spacing={6} align="stretch">
      {inquiries.map((inquiry) => (
        <Box
          key={inquiry.id}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          _hover={{ bg: "gray.50", cursor: "pointer" }}
        >
          <Link to={`/inquiries/${inquiry.id}`}>
            <Box
              key={inquiry.id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              _hover={{ bg: "gray.50", cursor: "pointer" }}
            >
              {inquiry.image && (
                <img
                  src={inquiry.image}
                  alt="Inquiry"
                  width="100"
                  height="100"
                />
              )}

              <Text fontWeight="bold">Status: {inquiry.status}</Text>
              <Text fontWeight="bold" mt={2}>
                Created At:: {inquiry.created_at}
              </Text>
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
        </Box>
      ))}
      <Box alignSelf="center"></Box>
    </VStack>
  );
};

export default InquiryList;

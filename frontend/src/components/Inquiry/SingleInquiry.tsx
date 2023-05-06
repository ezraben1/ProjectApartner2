// SingleInquiry.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, VStack, Heading, Text, Button, Textarea } from "@chakra-ui/react";
import api from "../../utils/api";
import { Inquiry, Reply } from "../../types";
import { fetchUserId } from "../../utils/userId";
import { useUserType } from "../../utils/useUserType";

const SingleInquiry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [reply, setReply] = useState("");
  const { userType } = useUserType();

  const navigate = useNavigate();

  const getInquiry = async () => {
    try {
      const response = await api.get(`/core/inquiries/${id}/`);
      const data = await response.json();
      setInquiry(data);
      // Also fetch replies here
      const repliesResponse = await api.get(`/core/inquiries/${id}/replies/`);
      const repliesData = await repliesResponse.json();
      setReplies(repliesData);
    } catch (error) {
      console.error("Error fetching inquiry:", error);
    }
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [, setUserLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const id = await fetchUserId();
      setUserId(id);
      setUserLoading(false);
    };

    getUserId();
  }, []);

  useEffect(() => {
    getInquiry();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.remove(`/core/inquiries/${id}/`);
      navigate("/inquiries");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      const requestData = {
        message: reply,
        inquiry: id,
        sender: userId,
      };
      console.log("Sending request data:", requestData);
      try {
        // Add the API call to create a reply
        await api.post(`/core/inquiries/${id}/replies/`, requestData);

        // Refresh the inquiry and replies data
        getInquiry();
        setReply("");
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    } else {
      console.error("User ID not available");
    }
  };

  const closeInquiry = async () => {
    try {
      await api.post(`/core/inquiries/${id}/close/`, {}); // Pass an empty object as the second argument
      getInquiry(); // Refresh the inquiry data to display the updated status
    } catch (error) {
      console.error("Error closing inquiry:", error);
    }
  };

  if (!inquiry) {
    return <Text>Loading...</Text>;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h1" size="2xl">
        Inquiry Details
      </Heading>
      <Box p={6} bg="white" shadow="md" rounded="md">
        {inquiry.image && (
          <div>
            <Text fontWeight="bold" mb={2}>
              Image:
            </Text>
            <img src={inquiry.image} alt="Inquiry" width="100" height="100" />
          </div>
        )}
        <Text fontWeight="bold" mb={2}>
          Status:
        </Text>
        <Text mb={4}>{inquiry.status}</Text>
        <Text fontWeight="bold" mb={2}>
          Apartment:
        </Text>
        <Text mb={4}>{inquiry.apartment.address}</Text>
        <Text fontWeight="bold" mb={2}>
          Sender:
        </Text>
        <Text mb={4}>
          {inquiry.sender.first_name} {inquiry.sender.last_name}
        </Text>
        <Text fontWeight="bold" mb={2}>
          Receiver:
        </Text>
        <Text mb={4}>
          {inquiry.receiver
            ? `${inquiry.receiver.first_name} ${inquiry.receiver.last_name}`
            : "N/A"}
        </Text>
        <Text fontWeight="bold" mb={2}>
          Type:
        </Text>
        <Text mb={4}>{inquiry.type}</Text>
        <Text fontWeight="bold" mb={2}>
          Message:
        </Text>
        <Text>{inquiry.message}</Text>
      </Box>

      <Box p={6} bg="white" shadow="md" rounded="md">
        <Heading as="h2" size="lg" mb={4}>
          Replies
        </Heading>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Box key={reply.id} p={4} bg="gray.100" rounded="md" mb={4}>
              <Text fontWeight="bold" mb={2}>
                {reply.sender.first_name} {reply.sender.last_name}:
              </Text>
              <Text>{reply.message}</Text>
            </Box>
          ))
        ) : (
          <Text>No replies yet.</Text>
        )}
      </Box>

      <Box p={6} bg="white" shadow="md" rounded="md">
        <Heading as="h2" size="lg" mb={4}>
          Reply to Inquiry
        </Heading>
        {inquiry.status === "open" ? (
          <form onSubmit={handleSubmitReply}>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply here..."
              mb={4}
            />
            <Button type="submit" colorScheme="blue">
              Send Reply
            </Button>
          </form>
        ) : (
          <Text>This inquiry is closed and cannot be replied to.</Text>
        )}
        {userType === "owner" && inquiry.status === "open" && (
          <Button
            mt={4}
            colorScheme="orange"
            onClick={closeInquiry}
            _hover={{ bg: "orange.500" }}
          >
            Close Inquiry
          </Button>
        )}
      </Box>

      <Box p={6} bg="white" shadow="md" rounded="md">
        <Button
          colorScheme="red"
          onClick={handleDelete}
          _hover={{ bg: "red.500" }}
        >
          Delete Inquiry
        </Button>
      </Box>
    </VStack>
  );
};

export default SingleInquiry;

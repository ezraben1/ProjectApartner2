import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Input,
} from "@chakra-ui/react";
import api from "../../utils/api";

interface InquiryFormProps {
  apartmentID: string | number;
  url: string;
  sender: number | string;
  receiver_id: number;
}

const InquiryForm: React.FC<InquiryFormProps> = ({
  url,
  sender,
  receiver_id,
  apartmentID,
}) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("defects");
  const [image, setImage] = useState<File | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("apartment_id", apartmentID.toString());
      formData.append("message", message);
      formData.append("type", type);
      formData.append("sender", sender.toString());
      console.log("receiver_id:", receiver_id); // Add this line to log receiver_id

      formData.append("receiver_id", receiver_id.toString());
      formData.append("status", "open");

      if (image) {
        formData.append("image", image);
      }

      console.log("Sending inquiry data:", formData);
      const response = await api.postWithFormData(url, formData);

      if (response.ok) {
        alert("Message sent successfully");
      } else {
        const errorData = await response.json();
        console.error("Error sending message:", errorData);
        alert("Error sending message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel>Send a message to the owner</FormLabel>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
        />
      </FormControl>
      <select
        value={type}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setType(e.target.value)
        }
      >
        <option value="defects">Defects</option>
        <option value="questions">Questions</option>
        <option value="payment">Payment</option>
        <option value="problem">Problem</option>
        <option value="other">Other</option>
      </select>
      <FormControl>
        <FormLabel>Attach an image (optional)</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
      </FormControl>
      <Button onClick={handleSendMessage} colorScheme="blue">
        Send Message
      </Button>
    </>
  );
};

export default InquiryForm;

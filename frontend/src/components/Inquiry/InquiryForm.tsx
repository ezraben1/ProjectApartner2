import React, { useState } from 'react';
import { FormControl, FormLabel, Textarea, Button } from '@chakra-ui/react';
import api from '../../utils/api';

interface InquiryFormProps {
  url: string;
  sender: number | string;
  receiver: number;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ url, sender, receiver }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('defects');
  
    const handleSendMessage = async () => {
      if (!message.trim()) {
        alert('Please enter a message');
        return;
      }
  
      try {
        const response = await api.post(url, { message, type, sender, receiver });
  
        if (response.ok) {
          alert('Message sent successfully');
        } else {
          alert('Error sending message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
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
        <select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}>
          <option value="defects">Defects</option>
          <option value="questions">Questions</option>
          <option value="payment">Payment</option>
          <option value="problem">Problem</option>
          <option value="other">Other</option>
        </select>
        <Button onClick={handleSendMessage} colorScheme="blue">
          Send Message
        </Button>
      </>
    );
  };
  

export default InquiryForm;

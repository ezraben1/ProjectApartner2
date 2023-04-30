import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bill } from '../../types';
import api from '../../utils/api';
import DeleteBill from './DeleteBill';
import UpdateBillForm from './UpdateBillForm';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

const SingleBill: React.FC = () => {
    const { apartmentId, billId } = useParams<{ apartmentId?: string; billId?: string }>();
    const [bill, setBill] = useState<Bill | null>(null);

  const fetchBill = async () => {
    try {
      const response = await api.get(`/owner/owner-apartments/${apartmentId}/bills/${billId}/`);
      const data = await response.json();
      setBill(data);
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [billId]);

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <Box maxW="800px" mx="auto" p="6">
      <VStack align="start" spacing={4}>
        <Heading>{bill.bill_type}</Heading>
        <Text>Amount: ${bill.amount}</Text>
        <Text>Date: {bill.date}</Text>
        <DeleteBill apartmentId={apartmentId || ''} billId={billId || ''} />
        <UpdateBillForm
          apartmentId={apartmentId || ''}
          billId={billId || ''}
          bill={bill || null}
          onUpdate={(updatedBill: Bill) => {
            console.log('Bill updated:', updatedBill);
            // handle the update
          }}
        />
      </VStack>
    </Box>
  );
};

export default SingleBill;

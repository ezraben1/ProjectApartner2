import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bill } from '../../types';
import api from '../../utils/api';
import DeleteBill from './DeleteBill';
import UpdateBillForm from './UpdateBillForm';
import { VStack, Heading, Text, Box, Button } from '@chakra-ui/react';
import UploadFileForm from '../images/UploadFileForm';
import { handleDownloadFile } from '../images/handleDownloadFile';
import FileStatus from '../images/fileStatus';
import DeleteFileButton from '../images/DeleteFileButton';

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

  const handleDownload = () => {
    handleDownloadFile(
      `/owner/owner-apartments/${apartmentId}/bills/${billId}/download/`,
      billId || '',
      bill?.bill_type || 'bill'
    );
  };
  
  const handleUpload = async (updatedBill: Bill) => {
    setBill(updatedBill);
  };

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
        <UploadFileForm
          onUpload={handleUpload}
          accept=".pdf"
          apiEndpoint={`/owner/owner-apartments/${apartmentId}/bills/${billId}/`}
        />
        <UpdateBillForm
          apartmentId={apartmentId || ''}
          billId={billId || ''}
          bill={bill || null}
          onUpdate={(updatedBill: Bill) => {
            console.log('Bill updated:', updatedBill);
            // handle the update
          }}
        />
        {bill.file ? (
          <Button colorScheme="blue" onClick={handleDownload}>
            Download File
          </Button>
        ) : (
          <Text>No file uploaded</Text>
        )}
         <FileStatus hasFile={!!bill.file} fileType="Bill" />
         <DeleteFileButton
          fileType="bill"
          apiEndpoint={`/owner/owner-apartments/${apartmentId}/bills/${billId}/delete-file/`}
          onDelete={() => {
            setBill({ ...bill, file: null });
          }}
        />

      </VStack>
    </Box>
  );
};

export default SingleBill;

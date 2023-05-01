import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Contract } from '../../types';
import { Box, Heading, VStack, Text, HStack, Button } from '@chakra-ui/react';
import UpdateContractForm from './UpdateContractForm';
import DeleteContract from './DeleteContract';
import api from '../../utils/api';
import UploadFileForm from '../images/UploadFileForm';
import { handleDownloadFile } from '../images/handleDownloadFile';
import FileStatus from '../images/fileStatus';
import DeleteFileButton from '../images/DeleteFileButton';

const OwnerSingleContract: React.FC = () => {
    const { apartmentId, roomId, contractId } = useParams<{
      apartmentId: string;
      roomId: string;
      contractId: string;
    }>();
    const [contract, setContract] = useState<Contract | null>(null);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    console.log('apartmentId:', apartmentId, 'roomId:', roomId, 'contractId:', contractId);

    const fetchContract = async () => {
        try {
          const response = await api.get(`/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contractId}/`);
          const data = await response.json();
          setContract(data);
          setStatus('success');
        } catch (error) {
          console.error('Error fetching contract:', error);
          setStatus('error');
        }
      };
      
  
    useEffect(() => {
      fetchContract();
    }, [apartmentId, roomId, contractId]);
  
    const navigate = useNavigate();
  
    const handleContractDelete = () => {
      navigate(-1);
    };
  
    const handleUpload = async (updatedContract: Contract) => {
      setContract(updatedContract);
    };
  
    const handleDownload = () => {
      handleDownloadFile(
        `/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contractId}/download/`,
        contractId || '',
        'contract',
        'pdf' // Assuming the file extension is 'pdf', change it if necessary
      );
    };
    

    if (status === 'loading') {
      return <div>Loading...</div>;
    }
  
    if (status === 'error' || !contract) {
        console.log("apartmentId: ", apartmentId);
        console.log("roomId: ", roomId);
        console.log("contractId: ", contractId);
      return <div>Error loading contract data.</div>;
      
    }

    
    return (
      <Box>
        <Heading as="h1" size="xl" textAlign="center" my={8}>
          Contract #{contract.id}
        </Heading>
        <VStack spacing={3} align="start">
          <Text>
            <strong>Start Date:</strong> {contract.start_date}
          </Text>
          <Text>
            <strong>End Date:</strong> {contract.end_date}
          </Text>
          <Text>
            <strong>Deposit Amount:</strong> {contract.deposit_amount}
          </Text>
          <Text>
            <strong>Rent Amount:</strong> {contract.rent_amount}
          </Text>
        </VStack>
        <HStack spacing={4} mt={6}>
        <UpdateContractForm
        contract={contract}
        onUpdate={(updatedContract: Contract) => setContract(updatedContract)}
        apartmentId={apartmentId}
        roomId={roomId}
          />
          <DeleteContract
            contract={contract}
            onDelete={handleContractDelete}
            apartmentId={apartmentId}
            roomId={roomId}
          />
          <UploadFileForm
          onUpload={handleUpload}
          accept=".pdf"
          apiEndpoint={`/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contractId}/`}
        />
        <Button colorScheme="blue" onClick={handleDownload}>
          Download Contract
        </Button>
        <FileStatus hasFile={!!contract.file} fileType="Contract" />
        <DeleteFileButton
        fileType="contract"
        apiEndpoint={`/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contractId}/delete-file/`}
        onDelete={() => {
          setContract({ ...contract, file: null });
  }}
/>

        </HStack>
      </Box>
    );
  };
  
  export default OwnerSingleContract;

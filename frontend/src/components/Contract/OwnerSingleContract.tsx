import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Contract } from '../../types';
import { Box, Heading, Button, StatGroup, StatLabel, StatNumber, Stat, Stack } from '@chakra-ui/react';
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
  <StatGroup width="100%" justifyContent="space-around" mt={4}>
  <Stat>
    <StatLabel fontSize="md" textAlign="center">Start </StatLabel>
    <StatNumber fontSize="sm" textAlign="center">
      {contract.start_date}
    </StatNumber>
  </Stat>
  
  <Stat>
    <StatLabel fontSize="md" textAlign="center">Deposit </StatLabel>
    <StatNumber fontSize="sm" textAlign="center">
      {contract.deposit_amount}
    </StatNumber>
  </Stat>
  <Stat>
    <StatLabel fontSize="md" textAlign="center">Rent </StatLabel>
    <StatNumber fontSize="sm" textAlign="center">
      {contract.rent_amount}
    </StatNumber>
  </Stat>
  <Stat>
    <StatLabel fontSize="md" textAlign="center" >End</StatLabel>
    <StatNumber fontSize="sm" textAlign="center">
      {contract.end_date}
    </StatNumber>
  </Stat>
</StatGroup>


  <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={6}>
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
  </Stack>
</Box>
    );
    
  };
  
  export default OwnerSingleContract;

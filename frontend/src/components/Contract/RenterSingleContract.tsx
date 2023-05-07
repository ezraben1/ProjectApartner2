import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contract } from "../../types";
import {
  Box,
  Heading,
  Button,
  StatGroup,
  StatLabel,
  StatNumber,
  Stat,
} from "@chakra-ui/react";
import api from "../../utils/api";
import { handleDownloadFile } from "../images/handleDownloadFile";

const RenterSingleContract: React.FC = () => {
  const { roomId, contractId } = useParams<{
    roomId: string;
    contractId: string;
  }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  console.log("roomId:", roomId, "contractId:", contractId);

  const fetchContract = async () => {
    try {
      const response = await api.get(
        `/renter/my-room/${roomId}/contracts/${contractId}/`
      );
      const data = await response.json();
      setContract(data);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching contract:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchContract();
  }, [roomId, contractId]);

  const handleDownload = () => {
    handleDownloadFile(
      `/renter/my-room/${roomId}/contracts/${contractId}/download/`,
      contractId || "",
      "contract",
      "pdf"
    );
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !contract) {
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
          <StatLabel fontSize="md" textAlign="center">
            Start{" "}
          </StatLabel>
          <StatNumber fontSize="sm" textAlign="center">
            {contract.start_date}
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel fontSize="md" textAlign="center">
            Deposit{" "}
          </StatLabel>
          <StatNumber fontSize="sm" textAlign="center">
            {contract.deposit_amount}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="md" textAlign="center">
            Rent{" "}
          </StatLabel>
          <StatNumber fontSize="sm" textAlign="center">
            {contract.rent_amount}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="md" textAlign="center">
            End
          </StatLabel>
          <StatNumber fontSize="sm" textAlign="center">
            {contract.end_date}
          </StatNumber>
        </Stat>
      </StatGroup>
      <Button colorScheme="blue" onClick={handleDownload}>
        Download Contract
      </Button>
    </Box>
  );
};

export default RenterSingleContract;

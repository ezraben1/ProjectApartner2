import { useParams } from "react-router-dom";
import { Contract } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useEffect, useState } from "react";
import { Container, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { handleDownloadFile } from "../images/handleDownloadFile";
import { Button } from "@chakra-ui/react";

const SearcherSingleContract: React.FC = () => {
  const { roomId } = useParams<{
    roomId: string;
    contractId: string;
  }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [contractData, status] = useAuthorizedData<Contract>(
    `/searcher/searcher-search/${roomId}/contract/${7}/`
  );

  useEffect(() => {
    if (status === "idle" && contractData) {
      setContract(contractData);
    }
  }, [contractData, status]);

  const handleDownload = () => {
    handleDownloadFile(
      `/searcher/searcher-search/${roomId}/contract/${contract?.id}/download/`,
      `${contract?.id || ""}`,
      "contract",
      "pdf"
    );
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !contract) {
    return <div>Error loading contract data.</div>;
  }

  return (
    <Container>
      <h1 className="my-4">Contract #{contract.id}</h1>
      <Card>
        <ListGroup variant="flush">
          <ListGroupItem>
            <strong>Start Date:</strong> {contract.start_date}
          </ListGroupItem>
          <ListGroupItem>
            <strong>End Date:</strong> {contract.end_date}
          </ListGroupItem>
          <ListGroupItem>
            <strong>Deposit Amount:</strong> {contract.deposit_amount}
          </ListGroupItem>
          <ListGroupItem>
            <strong>Rent Amount:</strong> {contract.rent_amount}
          </ListGroupItem>
        </ListGroup>
      </Card>
      <Button colorScheme="green" onClick={handleDownload}>
        Download Contract
      </Button>
    </Container>
  );
};

export default SearcherSingleContract;

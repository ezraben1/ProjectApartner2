import { useEffect, useState } from 'react';
import { Contract } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractData, status] = useAuthorizedData<Contract[]>('/owner/owner-contarcts/');

  useEffect(() => {
    if (status === 'idle' && contractData) {
      setContracts(contractData);
    }
  }, [contractData, status]);

  return (
    <div>
      <h1 className="my-4">My Contracts</h1>
      <ListGroup>
        {contracts.map((contract: Contract) => (
          <ListGroup.Item key={contract.id}>
            <Link to={`/owner/contracts/${contract.id}`}>
              <h2>Contract #{contract.id}</h2>
              <p>Start Date: {contract.start_date}</p>
              <p>End Date: {contract.end_date}</p>
              <p>Deposit Amount: {contract.deposit_amount}</p>
              <p>Rent Amount: {contract.rent_amount}</p>
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default MyContracts;

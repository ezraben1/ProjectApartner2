// DeleteBill.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

interface DeleteBillProps {
  apartmentId: string;
  billId: string;
  navigateAfterDelete?: boolean;
  onDelete?: () => void;
}

const DeleteBill: React.FC<DeleteBillProps> = ({ apartmentId, billId, navigateAfterDelete = false }) => {
  const navigate = useNavigate();

  const deleteBill = async () => {
    try {
      await api.remove(`/owner/owner-apartments/${apartmentId}/bills/${billId}/`);
      if (navigateAfterDelete) {
        navigate(`/owner/my-apartments/${apartmentId}/bills`);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  return (
    <Button variant="danger" onClick={deleteBill}>
      Delete Bill
    </Button>
  );
};

export default DeleteBill;

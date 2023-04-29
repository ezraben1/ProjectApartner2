import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

interface DeleteApartmentProps {
  apartmentId?: string;
}

const DeleteApartment: React.FC<DeleteApartmentProps> = ({ apartmentId }) => {
  const navigate = useNavigate();

  const deleteApartment = async () => {
    try {
      const response = await api.remove(`/owner/owner-apartments/${Number(apartmentId)}/`);
      if (response.ok) {
        alert('Apartment deleted successfully');
        navigate('/owner/my-apartments');
      } else {
        throw new Error('Failed to delete apartment');
      }
    } catch (error) {
      console.error('Error deleting apartment:', error);
      alert('Failed to delete apartment');
    }
  };

  return (
    <Button variant="danger" onClick={deleteApartment}>
      Delete Apartment
    </Button>
  );
};

export default DeleteApartment;

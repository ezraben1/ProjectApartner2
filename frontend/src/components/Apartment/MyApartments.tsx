import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AddApartmentForm from './AddApartmentForm';

const MyApartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [apartmentData, status] = useAuthorizedData<Apartment[]>('/owner/owner-apartments/');

  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartments(apartmentData);
    }
  }, [apartmentData, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !apartments) {
    return <div>Error loading apartment data.</div>;
  }

  return (
    <div>
      <h1 className="my-4">My Apartments</h1>
      <AddApartmentForm />

      <ListGroup>
        {apartments.map((apartment: Apartment) => (
          <Link key={apartment.id} to={`/owner/my-apartments/${apartment.id}`}>
            <ListGroup.Item>
              <div className="d-flex justify-content-between align-items-center">
                <h2>{apartment.address}</h2>
                <span className="badge bg-danger">{apartment.address}</span>
              </div>
              <p className="my-2">{apartment.description}</p>
              <ListGroup variant="flush">
                {apartment.rooms.map((room: Room) => (
                  <Link key={room.id} to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}>
                    <ListGroup.Item>
                      <h3>{room.description}</h3>
                      <p className="mb-0">Price per month: {room.price_per_month}</p>
                      <p className="mb-0">Size: {room.size}</p>
                    </ListGroup.Item>
                  </Link>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </div>
  );
};

export default MyApartments;

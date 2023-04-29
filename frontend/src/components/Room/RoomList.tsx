import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import { ListGroup } from 'react-bootstrap';

interface RoomListProps {
  rooms: Room[] | null;
  apartmentId: number | null;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, apartmentId }) => {
  return (
    <div>
      <h2>Rooms</h2>
      <ListGroup>
        {rooms?.map((room) => (
          <Link key={room.id} to={`/owner/my-apartments/${apartmentId}/room/${room.id}`}>
            <ListGroup.Item>
              <h3>{room.description}</h3>
              <p>Size: {room.size}</p>
              <p>Price per month: {room.price_per_month}</p>
              <p>Window: {room.window ? 'Yes' : 'No'}</p>
              {/* Add more room details if needed */}
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </div>
  );
};

export default RoomList;

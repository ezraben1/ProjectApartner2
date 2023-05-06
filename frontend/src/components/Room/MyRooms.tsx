import { useEffect, useState } from "react";
import RoomList from "./RoomList";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";

const MyRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomData, status] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>("/owner/owner-rooms/");

  useEffect(() => {
    if (status === "idle" && roomData) {
      setRooms(roomData.results);
    }
  }, [roomData, status]);

  return (
    <div>
      <h1>My Rooms</h1>
      <RoomList rooms={rooms} apartmentId={null} />
    </div>
  );
};

export default MyRooms;

import { useEffect, useState } from "react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";
import SearchFilters from "./SearchFilters";

const SearcherSearch: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);

  const [roomData, status] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>("/searcher/searcher-search/");
  const handleFilterSubmit = (filters: { [key: string]: any }) => {
    const filtered = rooms.filter((room) => {
      return room.apartment.address
        .toLowerCase()
        .includes(filters.address.toLowerCase());
    });
    setRooms(filtered);
  };

  useEffect(() => {
    if (status === "idle" && roomData) {
      setRooms(roomData.results);
    }
  }, [roomData, status]);

  return (
    <div>
      <SearchFilters onFilterSubmit={handleFilterSubmit} />
    </div>
  );
};

export default SearcherSearch;

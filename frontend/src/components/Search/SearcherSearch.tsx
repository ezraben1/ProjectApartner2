import { useEffect, useState } from "react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";
import SearchFilters from "./SearchFilters";
import Pagination from "../../layout/Pagination";

const SearcherSearch: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [url, setUrl] = useState("/searcher/searcher-search/");

  const [roomData, status] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>(url);

  const handleFilterSubmit = (newUrl: string) => {
    setUrl(newUrl);
  };

  useEffect(() => {
    if (status === "idle" && roomData) {
      setRooms(roomData.results);
    }
  }, [roomData, status]);

  const onPaginate = (url: string) => {
    setUrl(url);
  };

  return (
    <div>
      <SearchFilters onFilterSubmit={handleFilterSubmit} rooms={rooms} />
      <Pagination
        next={roomData?.next ?? null}
        previous={roomData?.previous ?? null}
        onPaginate={onPaginate}
      />
    </div>
  );
};

export default SearcherSearch;

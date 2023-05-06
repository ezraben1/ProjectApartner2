import React, { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";
import SearcherRoomList from "../Room/SearcherRoomList";

interface RoomFiltersProps {
  onFilterSubmit: (filters: { [key: string]: any }) => void;
}

const SearchFilters: React.FC<RoomFiltersProps> = ({ onFilterSubmit }) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    address: "",
    minPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const queryParam =
    filters.address || filters.minPrice
      ? `?search=${filters.address}&min_price=${filters.minPrice}`
      : "";
  const [data] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>(`/searcher/searcher-search/${queryParam}`);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilterSubmit(filters);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl id="address">
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            name="address"
            placeholder="Enter apartment address"
            value={filters.address}
            onChange={handleChange}
          />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <FormControl id="minPrice">
          <FormLabel>Minimum Price</FormLabel>
          <Input
            type="text"
            name="minPrice"
            placeholder="Enter minimum price"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" mt={2}>
          Apply Filters
        </Button>
      </form>
      <SearcherRoomList rooms={data?.results || []} apartmentId={null} />
    </>
  );
};

export default SearchFilters;

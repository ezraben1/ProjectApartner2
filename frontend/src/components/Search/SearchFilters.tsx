import React, { useMemo, useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";
import SearcherRoomList from "../Room/SearcherRoomList";

interface RoomFiltersProps {
  onFilterSubmit: (newUrl: string) => void;
  rooms: Room[];
}

const SearchFilters: React.FC<RoomFiltersProps> = ({ onFilterSubmit }) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    search: "",
    balcony: "",
    bbq_allowed: "",
    smoking_allowed: "",
    allowed_pets: "",
    ac: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const queryParam = useMemo(() => {
    const params = new URLSearchParams();

    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }

    return `?${params.toString()}`;
  }, [filters]);
  const [data] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>(filters.url || `/searcher/searcher-search/${queryParam}`);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilterSubmit(`/searcher/searcher-search/${queryParam}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl id="search">
          <FormControl id="address">
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              name="search"
              placeholder="Enter search query"
              value={filters.search}
              onChange={handleChange}
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </FormControl>
        <FormControl id="minPrice"></FormControl>
        <FormControl id="balcony">
          <FormLabel>Balcony</FormLabel>
          <Select
            name="balcony"
            value={filters.balcony}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormControl>
        <FormControl id="bbq_allowed">
          <FormLabel>BBQ Allowed</FormLabel>
          <Select
            name="bbq_allowed"
            value={filters.bbq_allowed}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormControl>
        <FormControl id="smoking_allowed">
          <FormLabel>Smoking Allowed</FormLabel>
          <Select
            name="smoking_allowed"
            value={filters.smoking_allowed}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormControl>
        <FormControl id="allowed_pets">
          <FormLabel>Pets Allowed</FormLabel>
          <Select
            name="allowed_pets"
            value={filters.allowed_pets}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormControl>
        <FormControl id="ac">
          <FormLabel>AC</FormLabel>
          <Select
            name="ac"
            value={filters.ac}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
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

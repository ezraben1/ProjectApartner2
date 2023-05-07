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
import { Inquiry } from "../../types";
import InquiryList from "./InquiryList";

interface InquiryFiltersProps {
  onFilterSubmit: (filters: { [key: string]: any }) => void;
}

const InquiryFilters: React.FC<InquiryFiltersProps> = ({ onFilterSubmit }) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    message: "",
    status: "",
    type: "",
    apartment: "",
    sender: "",
    receiver: "",
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
    results: Inquiry[];
  }>(filters.url || `/core/inquiries/${queryParam}`);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilterSubmit({ ...filters, url: `/core/inquiries/${queryParam}` });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl id="search">
          <FormControl id="message">
            <FormLabel>Search</FormLabel>
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
        <FormControl id="status">
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </Select>
        </FormControl>
        <FormControl id="type">
          <FormLabel>Type</FormLabel>
          <Select
            name="type"
            value={filters.type}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="defects">Defects</option>
            <option value="questions">Questions</option>
            <option value="payment">Payment</option>
            <option value="problem">Problem</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>
        <FormControl id="apartment">
          <FormLabel>Apartment</FormLabel>
          <Input
            type="text"
            name="apartment"
            placeholder="Enter apartment name or ID"
            value={filters.apartment}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="sender">
          <FormLabel>Sender</FormLabel>
          <Input
            type="text"
            name="sender"
            placeholder="Sender"
            value={filters.sender}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="receiver">
          <FormLabel>Receiver</FormLabel>
          <Input
            type="text"
            name="receiver"
            placeholder="Receiver"
            value={filters.receiver}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="orderBy">
          <FormLabel>Order By</FormLabel>
          <Select
            name="orderBy"
            value={filters.orderBy}
            onChange={handleSelectChange}
            placeholder="Select"
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue" mt={2}>
          Apply Filters
        </Button>
      </form>
      <InquiryList inquiries={data?.results || []} />
    </>
  );
};

export default InquiryFilters;

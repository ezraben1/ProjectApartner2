import React, { useState, useEffect, ComponentType } from "react";
import {
  Select,
  Input,
  VStack,
  Heading,
  List,
  Box,
  Text,
} from "@chakra-ui/react";
import api from "./api";

interface FilterSortProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  filterFields: string[];
  sortOptions: { value: string; label: string }[];
}

function withFilterSort<T>(
  WrappedComponent: ComponentType<FilterSortProps<T>>
) {
  return function FilterSort({
    filterFields,
    sortOptions,
    ...props
  }: FilterSortProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOption(event.target.value);
    };

    useEffect(() => {
      const fetchItems = async () => {
        try {
          const response = await api.get(
            `/api/${WrappedComponent.name.toLowerCase()}/`
          );
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error(
            `Error fetching ${WrappedComponent.name.toLowerCase()}s:`,
            error
          );
        }
      };

      fetchItems();
    }, []);

    const filteredItems = items.filter((item) =>
      filterFields.some((field) => {
        const fieldValue = (item as any)[field];
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );

    let sortedItems = [...filteredItems];
    if (sortOption) {
      const [field, direction] = sortOption.split("-");
      sortedItems.sort((a, b) => {
        if (direction === "asc") {
          return (a as any)[field] - (b as any)[field];
        } else {
          return (b as any)[field] - (a as any)[field];
        }
      });
    }

    return (
      <Box maxW="800px" mx="auto" p="6">
        <VStack align="stretch" spacing={6}>
          <Heading as="h1" size="xl" textAlign="center" my={8}>
            {WrappedComponent.name}s
          </Heading>
          <Box justifyContent="space-between">
            <Input
              placeholder={`Search ${WrappedComponent.name}s`}
              value={searchTerm}
              onChange={handleSearch}
              w="50%"
            />
            <Select value={sortOption} onChange={handleSort} w="40%">
              <option value="">Sort by</option>
              {sortOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>
          <List spacing={4}>
            {sortedItems.length > 0 ? (
              sortedItems.map((item: T) => props.renderItem(item))
            ) : (
              <Text>No {WrappedComponent.name.toLowerCase()}s found.</Text>
            )}
          </List>
        </VStack>
      </Box>
    );
  };
}

export default withFilterSort;

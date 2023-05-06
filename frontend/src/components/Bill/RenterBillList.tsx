import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Bill } from "../../types";
import api from "../../utils/api";
import {
  VStack,
  Heading,
  Text,
  Box,
  List,
  ListItem,
  Input,
  Select,
} from "@chakra-ui/react";

const RetnerBillsList: React.FC = () => {
  const { apartmentId } = useParams<{ apartmentId?: string }>();
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get(`/renter/my-bills/`);
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
    fetchBills();
  }, [apartmentId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) =>
      bill.bill_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bills, searchTerm]);

  const sortedBills = useMemo(() => {
    let sorted = [...filteredBills];
    if (sortOption === "amount-low-to-high") {
      sorted.sort((a, b) => a.amount - b.amount);
    } else if (sortOption === "amount-high-to-low") {
      sorted.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === "date-oldest-to-newest") {
      sorted.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    } else if (sortOption === "date-newest-to-oldest") {
      sorted.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }
    return sorted;
  }, [filteredBills, sortOption]);

  return (
    <Box maxW="800px" mx="auto" p="6">
      <VStack align="stretch" spacing={6}>
        <Heading as="h1" size="xl" textAlign="center" my={8}>
          Bills
        </Heading>
        <Box justifyContent="space-between">
          <Input
            placeholder="Search bills"
            value={searchTerm}
            onChange={handleSearch}
            w="50%"
          />
          <Select value={sortOption} onChange={handleSort} w="40%">
            <option value="">Sort by</option>
            <option value="amount-low-to-high">Amount: Low to High</option>
            <option value="amount-high-to-low">Amount: High to Low</option>
            <option value="date-oldest-to-newest">
              Date: Oldest to Newest
            </option>
            <option value="date-newest-to-oldest">
              Date: Newest to Oldest
            </option>
          </Select>
        </Box>
        <List spacing={4}>
          {sortedBills.length > 0 ? (
            sortedBills.map((bill: Bill) => (
              <Link key={bill.id} to={`/renter/my-bills/${bill.id}`}>
                <ListItem p="4" rounded="md" bg="gray.50">
                  <VStack align="start" spacing={2}>
                    <Heading size="sm">{bill.bill_type}</Heading>
                    <Text>Amount: ${bill.amount}</Text>
                    <Text>Date: ${bill.date}</Text>
                  </VStack>
                </ListItem>
              </Link>
            ))
          ) : (
            <Text>No bills found for this apartment.</Text>
          )}
        </List>
      </VStack>
    </Box>
  );
};

export default RetnerBillsList;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Bill } from "../../types";
import api from "../../utils/api";
import DeleteBill from "./DeleteBill";
import AddBill from "./AddBill";
import { VStack, Heading, Text, Box, List, ListItem } from "@chakra-ui/react";

const BillsList: React.FC = () => {
  const { apartmentId } = useParams<{ apartmentId?: string }>();
  const [bills, setBills] = useState<Bill[]>([]);

  const fetchBills = async () => {
    try {
      const response = await api.get(
        `/owner/owner-apartments/${apartmentId}/bills/`
      );
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const addBill = (newBill: Bill) => {
    setBills([...bills, newBill]);
  };

  useEffect(() => {
    fetchBills();
  }, [apartmentId]);

  return (
    <Box maxW="800px" mx="auto" p="6">
      <VStack align="stretch" spacing={6}>
        <AddBill apartmentId={apartmentId || ""} onAdd={addBill} />
        <List spacing={4}>
          {bills.map((bill: Bill) => (
            <Link
              key={bill.id}
              to={`/owner/my-apartments/${apartmentId}/bills/${bill.id}`}
            >
              <ListItem
                p="4"
                rounded="md"
                bg="gray.50"
                boxShadow="md"
                transition="background 0.2s"
                _hover={{
                  bg: "gray.100",
                }}
              >
                <VStack align="start" spacing={2}>
                  <Heading size="sm">{bill.bill_type}</Heading>
                  <Text>Amount: ${bill.amount}</Text>
                  <Text>Date: {bill.date}</Text>
                  <DeleteBill
                    apartmentId={apartmentId || ""}
                    billId={bill.id.toString()}
                  />
                </VStack>
              </ListItem>
            </Link>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default BillsList;

import React, { useState } from "react";
import { Bill } from "../../types";
import api from "../../utils/api";
import { Button, Form } from "react-bootstrap";

interface UpdateBillFormProps {
  bill: Bill;
  apartmentId: string;
  billId: string;
  onUpdate: (updatedBill: Bill) => void;
}

const UpdateBillForm: React.FC<UpdateBillFormProps> = ({
  bill,
  apartmentId,
  onUpdate,
}) => {
  const [billType, setBillType] = useState(bill.bill_type);
  const [amount, setAmount] = useState(bill.amount);
  const [date, setDate] = useState(bill.date);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.patch(
        `/owner/owner-apartments/${bill.apartment}/bills/${bill.id}/`,
        {
          apartment: apartmentId,
          bill_type: billType,
          amount: amount,
          date: date,
        }
      );
      const updatedBill = await response.json();
      onUpdate(updatedBill);
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="billType">
        <Form.Label>Bill Type</Form.Label>
        <Form.Select
          value={billType}
          onChange={(e) => setBillType(e.target.value as Bill["bill_type"])}
        >
          {Bill.BILL_TYPES.map((type) => (
            <option key={type[0]} value={type[0]}>
              {type[1]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="amount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </Form.Group>
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>
      {/* Add a file input field for the bill file (if applicable) */}
      <Button type="submit">Update Bill</Button>
    </Form>
  );
};

export default UpdateBillForm;

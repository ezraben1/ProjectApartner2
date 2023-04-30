import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import api from '../../utils/api';
import { Bill } from '../../types';

interface AddBillProps {
  apartmentId: string;
  onAdd?: (newBill: Bill) => void;
}

const AddBill: React.FC<AddBillProps> = ({ apartmentId, onAdd = () => {} }) => {
  const [billType, setBillType] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post(`/owner/owner-bills/`, {
        apartment: apartmentId,
        bill_type: billType,
        amount,
        date,
      });
      const newBill = await response.json();
      onAdd(newBill);
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="billType">
        <Form.Label>Bill Type</Form.Label>
        <Form.Select value={billType} onChange={(e) => setBillType(e.target.value as Bill['bill_type'])}>
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
      <Button type="submit">Add Bill</Button>
    </Form>
  );
};

export default AddBill;

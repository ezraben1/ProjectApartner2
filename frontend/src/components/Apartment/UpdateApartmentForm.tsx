import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import api from '../../utils/api';
import { Apartment } from '../../types';

interface UpdateApartmentFormProps {
    apartment: Apartment;
    onUpdate: (updatedApartment: Apartment) => void;
  }
  const UpdateApartmentForm: React.FC<UpdateApartmentFormProps> = ({ apartment, onUpdate }) => {
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/owner/owner-apartments/${apartment.id}/`, {
                address,
                description,
                size
        });
  
        setAddress('');
        setDescription('');
        setSize('')
        alert('Apartment updated successfully!');
    } catch (error) {
      console.error('Error updating apartment:', error);
  
      if (error && (error as any).response && (error as any).response.data) {
        console.error('Server error message:', (error as any).response.data);
      }
  
      alert('Failed to update apartment.');
    }
  };
  
  

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="size">
        <Form.Label>Size</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Update Apartment
      </Button>
    </Form>
  );
};

export default UpdateApartmentForm;

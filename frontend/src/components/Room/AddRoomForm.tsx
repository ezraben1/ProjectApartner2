import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import api from "../../utils/api";
import { AxiosError } from "axios";

interface RoomFormData {
  description: string;
  size: string;
  price_per_month: number | null;
  window: boolean;
  apartment: number | null;
}

interface AddRoomFormProps {
  apartmentId: number;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ apartmentId }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    description: "",
    size: "",
    price_per_month: null,
    window: false,
    apartment: apartmentId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("formData:", formData);
      const requestData = new FormData();
      requestData.append("description", formData.description);
      requestData.append("size", formData.size);
      requestData.append(
        "price_per_month",
        formData.price_per_month!.toString()
      );
      requestData.append("window", formData.window ? "true" : "false");
      requestData.append("apartment", formData.apartment!.toString());

      const response = await api.postWithFormData(
        `/owner/owner-apartments/${apartmentId}/rooms/`,
        requestData
      );
      if (response.status === 201) {
        setFormData({
          description: "",
          size: "",
          price_per_month: null,
          window: false,
          apartment: apartmentId, // Updated this line
        });

        alert("Room added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error adding room:", errorData);
        alert(`Failed to add room: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Server error message:", axiosError.response.data);
      }
      console.error("Error adding room:", error);
      alert("Failed to add room.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              description: e.target.value,
            }))
          }
        />
      </Form.Group>

      <Form.Group controlId="size">
        <Form.Label>Size</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter size"
          value={formData.size}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              size: e.target.value,
            }))
          }
        />
      </Form.Group>

      <Form.Group controlId="price_per_month">
        <Form.Label>Price per month</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter price per month"
          value={formData.price_per_month || ""}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              price_per_month: parseInt(e.target.value, 10),
            }))
          }
        />
      </Form.Group>

      <Form.Group controlId="window">
        <Form.Check
          type="checkbox"
          label="Window"
          checked={formData.window}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              window: e.target.checked,
            }))
          }
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Room
      </Button>
    </Form>
  );
};

export default AddRoomForm;

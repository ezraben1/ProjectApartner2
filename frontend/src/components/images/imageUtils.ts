import api from "../../utils/api";

export const deleteImage = async (
  endpoint: string,
  onDelete: (imageId: number) => void,
  imageId: number
) => {
  try {
    await api.remove(endpoint);
    onDelete(imageId);
    alert('Image deleted successfully!');
  } catch (error) {
    console.error('Error deleting image:', error);

    if (error && (error as any).response && (error as any).response.data) {
      console.error('Server error message:', (error as any).response.data);
    }

    alert('Failed to delete image.');
  }
};

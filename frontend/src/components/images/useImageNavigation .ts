import { useState } from 'react';

const useImageNavigation = (imageItemsLength: number) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageNext = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % imageItemsLength);
  };

  const handleImagePrev = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + imageItemsLength) % imageItemsLength);
  };

  return { selectedImageIndex, handleImageNext, handleImagePrev };
};

export default useImageNavigation;

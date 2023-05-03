import React from 'react';
import { Box, IconButton, Image } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useDeleteImage } from './useDeleteImage';

interface ImageGalleryProps {
  images: any[];
  endpointBuilder: (imageId: number) => string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, endpointBuilder }) => {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const { deleteImage } = useDeleteImage();

  const handleImageNext = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleImagePrev = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleDeleteImage = (imageId: number) => {
    const endpoint = endpointBuilder(imageId);
    deleteImage(endpoint, (prev: any) => {
      if (prev) {
        return prev.filter((image: any) => image.id !== imageId);
      }
      return null;
    });
  };

  return (
    <>
      {images.map((image, index) => (
        <Box
          key={index}
          borderRadius="sm"
          overflow="hidden"
          display={selectedImageIndex === index ? 'block' : 'none'}
        >
          <Image
            src={image.image}
            alt="Image"
            objectFit="contain"
            boxSize="lg"
            onClick={() => handleDeleteImage(image.id)}
            cursor="pointer"
          />
        </Box>
      ))}
      <IconButton
        aria-label="Previous image"
        icon={<ChevronLeftIcon />}
        onClick={handleImagePrev}
        isDisabled={images.length <= 1}
        colorScheme="gray"
        variant="outline"
      />
      <IconButton
        aria-label="Next image"
        icon={<ChevronRightIcon />}
        onClick={handleImageNext}
        isDisabled={images.length <= 1}
        colorScheme="gray"
        variant="outline"
      />
    </>
  );
};

export default ImageGallery;

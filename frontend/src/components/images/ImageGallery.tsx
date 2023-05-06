import React, { useState } from "react";
import { Box, Flex, IconButton, Image } from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

interface ImageGalleryProps {
  images: { id: number; image: string }[];
  onDelete?: (imageId: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImagePrev = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleImageNext = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleDeleteImage = (imageId: number) => {
    onDelete && onDelete(imageId);
  };

  return (
    <Flex align="center" justify="center" mb={4}>
      {images && images.length > 0 && (
        <>
          <IconButton
            aria-label="Previous image"
            icon={<ChevronLeftIcon />}
            onClick={handleImagePrev}
            isDisabled={images.length <= 1}
            colorScheme="gray"
            variant="outline"
          />
          {images.map((image, index) => (
            <Box
              key={index}
              borderRadius="sm"
              overflow="hidden"
              display={selectedImageIndex === index ? "block" : "none"}
            >
              <Image
                src={image.image}
                alt={`Room image ${index}`}
                objectFit="contain"
                boxSize={{ base: "350px", md: "lg", lg: "xl" }}
              />
            </Box>
          ))}
          <IconButton
            aria-label="Next image"
            icon={<ChevronRightIcon />}
            onClick={handleImageNext}
            isDisabled={images.length <= 1}
            colorScheme="gray"
            variant="outline"
          />
          {onDelete && (
            <IconButton
              aria-label="Delete image"
              icon={<DeleteIcon />}
              onClick={() => handleDeleteImage(images[selectedImageIndex].id)}
              colorScheme="red"
              variant="outline"
              ml={2}
            />
          )}
        </>
      )}
    </Flex>
  );
};

export default ImageGallery;

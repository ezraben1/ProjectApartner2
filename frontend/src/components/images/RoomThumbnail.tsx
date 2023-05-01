import { Image } from '@chakra-ui/react';

const RoomThumbnail: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Image
      src={src}
      alt="Room thumbnail"
      width="100px"
      height="100px"
      objectFit="cover"
      borderRadius="md"
    />
  );
};

export default RoomThumbnail;
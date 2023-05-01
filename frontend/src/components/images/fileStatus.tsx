import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface FileStatusProps {
  hasFile: boolean;
  fileType: string;
}

const FileStatus: React.FC<FileStatusProps> = ({ hasFile, fileType }) => (
  <Box>
    {hasFile ? (
      <Text color="green.500">{fileType} file uploaded</Text>
    ) : (
      <Text color="red.500">No {fileType} file uploaded</Text>
    )}
  </Box>
);

export default FileStatus;

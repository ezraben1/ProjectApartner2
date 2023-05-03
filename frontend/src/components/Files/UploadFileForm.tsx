import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React, { ChangeEvent, useRef, useState } from 'react';
import api from '../../utils/api';

interface UploadFileFormProps {
  onUpload: (updatedData: any) => void;
  accept?: string;
  apiEndpoint: string;
}


const UploadFileForm: React.FC<UploadFileFormProps> = ({ onUpload, accept, apiEndpoint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fileInput.current?.files?.length) return;

    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.patch(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedData = await response.json();
      onUpload(updatedData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Upload File</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Bill File</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
            <FormControl>
            <FormLabel>File</FormLabel>
            <Input type="file" ref={fileInput} onChange={handleFileChange} accept={accept} />
          </FormControl>
              {file && (
                <Text mt={2}>Selected file: {file.name}</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button type="submit" mr={3}>Upload</Button>
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadFileForm;

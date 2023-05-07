import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface PaginationProps {
  next: string | null;
  previous: string | null;
  onPaginate: (url: string) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  next,
  previous,
  onPaginate,
}) => {
  return (
    <Box mt={4} display="flex" justifyContent="space-between">
      <Button
        colorScheme="blue"
        isDisabled={!previous}
        onClick={() => previous && onPaginate(previous)}
      >
        Previous
      </Button>
      <Button
        colorScheme="blue"
        isDisabled={!next}
        onClick={() => next && onPaginate(next)}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;

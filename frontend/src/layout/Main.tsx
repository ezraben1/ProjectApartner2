import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";

interface MainProps {
  children: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
  const maxW = useBreakpointValue({ base: "100%", md: "7xl" });
  return (
    <Box as="main" flex="1" py="6">
      <Container maxW={maxW}>
        <Row>
          <Col>{children}</Col>
        </Row>
      </Container>
    </Box>
  );
};

export default Main;

import { Box, Container } from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";

interface MainProps {
  children: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
  return (
    <Box as="main" flex="1" py="6">
      <Container maxW="7xl">
        <Row>
          <Col>{children}</Col>
        </Row>
      </Container>
    </Box>
  );
};

export default Main;

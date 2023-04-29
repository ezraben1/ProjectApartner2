// MinimalExample.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MinimalExample: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Test Heading</h1>
          <p>Test paragraph</p>
        </Col>
      </Row>
    </Container>
  );
};

export default MinimalExample;

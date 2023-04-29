import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 ">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5>About A-Partner</h5>
            <p className="text-muted">A-Partner is a platform that connects people who are looking for properties to rent with property owners and managers.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li>123 Main St.</li>
              <li>New York, NY 10001</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@a-partner.com</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect with Us</h5>
            <ul className="list-unstyled list-inline social mb-0">
              <li className="list-inline-item"><a href="#" className="text-white"><i className="bi bi-facebook"></i></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><i className="bi bi-twitter"></i></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><i className="bi bi-instagram"></i></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><i className="bi bi-linkedin"></i></a></li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-muted">© {new Date().getFullYear()} A-Partner. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

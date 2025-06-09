import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <FaExclamationTriangle
            size={100}
            className="text-warning mb-4"
          />
          <h1 className="display-1 fw-bold mb-4">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead text-muted mb-5">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              as={Link}
              to="/"
              variant="primary"
              size="lg"
            >
              Go to Home
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaUserGraduate } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 0',
      marginTop: 'auto'
    }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <div className="d-flex align-items-center">
              <FaUserGraduate size={20} className="me-2" />
              <p className="mb-0" style={{ fontSize: '0.75rem' }}>
                &copy; {currentYear} CDAC MUMBAI. All rights reserved.
              </p>
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex flex-column align-items-end gap-1">
              <div className="d-flex align-items-center">
                <FaMapMarkerAlt size={12} className="me-1" />
                <span style={{ fontSize: '0.75rem' }}>Sector 7, CBD Belapur, Navi Mumbai, Maharashtra 400614, India</span>
              </div>
              <div className="d-flex align-items-center">
                <FaPhone size={12} className="me-1" />
                <span style={{ fontSize: '0.75rem' }}>+91 9876543210</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 
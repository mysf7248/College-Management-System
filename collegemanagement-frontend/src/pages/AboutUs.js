import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-page py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={8} className="text-center">
            <h1 className="display-4 fw-bold mb-4" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Team
            </h1>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <img
                    src="/images/Fardeen.jpg"
                    alt="Person 1"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <h4 className="mb-2">Fardeen Khan</h4>
                <p className="text-muted mb-2">Backend Developer</p>
                <p className="text-muted small mb-3">
                  Leading the institution with over 20 years of experience in education and administration.
                </p>
                <div className="d-flex flex-column align-items-center gap-2">
                  <a 
                    href="mailto:fardeen.khan@example.com" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaEnvelope className="me-2" />fardeen.khan@example.com
                  </a>
                  <a 
                    href="tel:+919876543210" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaPhone className="me-2" />+91 98765 43210
                  </a>
                  <a 
                    href="https://linkedin.com/in/fardeen-khan" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaLinkedin className="me-2" />linkedin.com/in/fardeen-khan
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <img
                    src="/images/Casual Photo.jpg"
                    alt="Person 2"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <h4 className="mb-2">Mohd Yusuf</h4>
                <p className="text-muted mb-2">Full Stack Developer</p>
                <p className="text-muted small mb-3">
                  Dedicated to maintaining academic excellence and fostering student growth.
                </p>
                <div className="d-flex flex-column align-items-center gap-2">
                  <a 
                    href="mailto:mohd.yusuf@example.com" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaEnvelope className="me-2" />mohd.yusuf@example.com
                  </a>
                  <a 
                    href="tel:+919876543211" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaPhone className="me-2" />+91 98765 43211
                  </a>
                  <a 
                    href="https://linkedin.com/in/mohd-yusuf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaLinkedin className="me-2" />linkedin.com/in/mohd-yusuf
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <img
                    src="/images/Harshada.jpg"
                    alt="Person 3"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <h4 className="mb-2">Harshada Ghadge</h4>
                <p className="text-muted mb-2">Frontend Developer</p>
                <p className="text-muted small mb-3">
                  Spearheading technical innovations and curriculum development.
                </p>
                <div className="d-flex flex-column align-items-center gap-2">
                  <a 
                    href="mailto:harshada.ghadge@example.com" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaEnvelope className="me-2" />harshada.ghadge@example.com
                  </a>
                  <a 
                    href="tel:+919876543212" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaPhone className="me-2" />+91 98765 43212
                  </a>
                  <a 
                    href="https://linkedin.com/in/harshada-ghadge" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-decoration-none text-muted d-flex align-items-center contact-link"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                  >
                    <FaLinkedin className="me-2" />linkedin.com/in/harshada-ghadge
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs; 
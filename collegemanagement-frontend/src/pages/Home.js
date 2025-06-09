import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaUsers, FaChartLine, FaBuilding, FaLaptopCode, FaCertificate, FaExternalLinkAlt, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FaBuilding size={40} />,
      title: 'CDAC Mumbai',
      description: 'Centre for Development of Advanced Computing, Mumbai - A premier R&D organization under MeitY.'
    },
    {
      icon: <FaLaptopCode size={40} />,
      title: 'Advanced Computing',
      description: 'Specialized courses in High Performance Computing, AI/ML, and Software Development.'
    },
    {
      icon: <FaCertificate size={40} />,
      title: 'Industry Recognition',
      description: 'Government recognized certifications with excellent placement opportunities.'
    },
    {
      icon: <FaUsers size={40} />,
      title: 'Expert Faculty',
      description: 'Learn from experienced professionals and industry experts.'
    }
  ];

  const courses = [
    {
      title: 'PG-DAC',
      description: 'Post Graduate Diploma in Advanced Computing',
      duration: '6 Months',
      link: 'https://cdac.in/index.aspx?id=pgdac'
    },
    {
      title: 'PG-DESD',
      description: 'Post Graduate Diploma in Embedded Systems Design',
      duration: '6 Months',
      link: 'https://cdac.in/index.aspx?id=pgdesd'
    },
    {
      title: 'PG-DWCS',
      description: 'Post Graduate Diploma in Wireless and Cloud Computing',
      duration: '6 Months',
      link: 'https://cdac.in/index.aspx?id=pgdwcs'
    }
  ];

  return (
    <div className="home-page" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div className="text-white py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">
                Welcome to CDAC Mumbai
              </h1>
              <p className="lead mb-4">
                Empowering the future through advanced computing education and research.
                Join India's premier institution for technology and innovation.
              </p>
              {!user && (
                <div className="d-flex gap-3">
                  <Button as={Link} to="/login" variant="light" size="lg" className="fw-bold">
                    Login
                  </Button>
                  <Button as={Link} to="/register" variant="outline-light" size="lg" className="fw-bold">
                    Register
                  </Button>
                </div>
              )}
            </Col>
            <Col md={6} className="d-none d-md-block text-center">
              <div className="p-4 bg-white rounded shadow-lg" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <img
                  src="https://www.cdac.in/img/cdac-logo.png"
                  alt="CDAC Logo"
                  className="img-fluid"
                  style={{ maxHeight: '200px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Centre_for_Development_of_Advanced_Computing_logo.svg/1200px-Centre_for_Development_of_Advanced_Computing_logo.svg.png";
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5 fw-bold" style={{ color: '#764ba2' }}>Why Choose CDAC Mumbai?</h2>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm hover-lift" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                <Card.Body className="text-center p-4">
                  <div className="mb-3" style={{ color: '#667eea' }}>{feature.icon}</div>
                  <Card.Title className="fw-bold" style={{ color: '#764ba2' }}>{feature.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Courses Section */}
      <div className="py-5" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#764ba2' }}>Our Flagship Courses</h2>
          <Row className="g-4">
            {courses.map((course, index) => (
              <Col key={index} md={4}>
                <Card className="h-100 border-0 shadow-sm hover-lift" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}>
                  <Card.Body className="p-4">
                    <Card.Title className="fw-bold mb-3" style={{ color: '#764ba2' }}>{course.title}</Card.Title>
                    <Card.Text className="text-muted mb-3">
                      {course.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge" style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '8px 12px'
                      }}>{course.duration}</span>
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        style={{
                          borderColor: '#667eea',
                          color: '#667eea'
                        }}
                      >
                        Learn More <FaExternalLinkAlt size={12} />
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Location Section */}
      <div className="py-4" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <Container>
          <h2 className="text-center mb-4 fw-bold" style={{ color: '#764ba2' }}>Our Location</h2>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <h5 className="fw-bold mb-3" style={{ color: '#764ba2' }}>CDAC Mumbai</h5>
                  <div className="d-flex align-items-start mb-2">
                    <FaMapMarkerAlt size={16} className="me-2 mt-1" style={{ color: '#667eea' }} />
                    <div>
                      <h6 className="fw-bold mb-1 small">Address</h6>
                      <p className="text-muted mb-0 small">
                        Juhu Campus, Gulmohar Cross Road No. 9,<br />
                        Juhu, Mumbai - 400049,<br />
                        Maharashtra, India
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <FaPhone size={16} className="me-2 mt-1" style={{ color: '#667eea' }} />
                    <div>
                      <h6 className="fw-bold mb-1 small">Phone</h6>
                      <p className="text-muted mb-0 small">+91 22 2620 1606</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <FaEnvelope size={16} className="me-2 mt-1" style={{ color: '#667eea' }} />
                    <div>
                      <h6 className="fw-bold mb-1 small">Email</h6>
                      <p className="text-muted mb-0 small">info@cdac.in</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <div className="rounded shadow-sm overflow-hidden" style={{ height: '300px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.1234567890123!2d72.8272!3d19.0989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676000000%3A0x1234567890abcdef!2sCDAC%20Mumbai!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <div className="py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
      }}>
        <Container className="text-center text-white">
          <h2 className="mb-4 fw-bold">Start Your Journey with CDAC Mumbai</h2>
          <p className="lead mb-4">
            Join thousands of successful professionals who transformed their careers with CDAC.
          </p>
          {!user && (
            <Button 
              as={Link} 
              to="/register" 
              variant="light" 
              size="lg" 
              className="fw-bold px-4"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Apply Now
            </Button>
          )}
        </Container>
      </div>
  </div>
);
};

export default Home;
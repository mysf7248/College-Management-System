import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
              <p className="lead">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          {/* Contact Information */}
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="mb-4">Get in Touch</h3>
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-0">Email</h6>
                    <p className="text-muted mb-0">contact@collegemanagement.com</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FaPhone className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-0">Phone</h6>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-0">Address</h6>
                    <p className="text-muted mb-0">
                      123 Education Street<br />
                      Academic City, AC 12345
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Form */}
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="mb-4">Send us a Message</h3>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" size="lg">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact; 
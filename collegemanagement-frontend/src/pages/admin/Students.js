import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Card, Spinner, Alert, Button, Modal, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaUserGraduate, FaPlus, FaTrash } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/students');
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses');
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      }
    } catch (err) {}
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/students/${selectedStudent.id}/enroll/${selectedCourse}`);
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data || 'Error enrolling student in course');
    }
  };

  const handleUnenroll = async (studentId, courseId) => {
    if (window.confirm('Are you sure you want to remove this course enrollment?')) {
      try {
        await axios.delete(`/api/students/${studentId}/enroll/${courseId}`);
        fetchStudents();
      } catch (err) {
        alert('Error removing course enrollment');
      }
    }
  };

  const handleEnrollAll = async (studentId) => {
    if (window.confirm('Are you sure you want to enroll this student in all available courses?')) {
      try {
        await axios.post(`/api/students/${studentId}/enroll-all`);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data || 'Error enrolling student in all courses');
      }
    }
  };

  const openEnrollModal = (student) => {
    setSelectedStudent(student);
    setSelectedCourse('');
    setShowModal(true);
  };

  // Helper function to get all enrolled courses for a student
  const getStudentCourses = (student) => {
    const courses = new Set();
    if (Array.isArray(student.enrollments)) {
      student.enrollments.forEach(enrollment => {
        if (enrollment.course) {
          courses.add(enrollment.course);
        }
      });
    }
    if (Array.isArray(student.enrolledCourses)) {
      student.enrolledCourses.forEach(course => {
        courses.add(course);
      });
    }
    return Array.from(courses);
  };

  return (
    <div className="container-fluid px-4 py-4" style={{
      background: 'linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4" style={{gap: 16}}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 16,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(102,126,234,0.10)'
        }}>
          <FaUserGraduate size={32} className="text-white" />
        </div>
        <h2 className="mb-0" style={{
          color: '#2d3748',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 1
        }}>Manage Students</h2>
      </div>

      {/* Loading, Error, Empty States */}
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" style={{width: 60, height: 60}} />
          <div className="mt-3 fw-bold text-secondary">Loading students...</div>
        </div>
      ) : error ? (
        <Alert variant="danger" className="shadow-sm text-center">{error}</Alert>
      ) : students.length === 0 ? (
        <Alert variant="info" className="shadow-sm text-center">No students found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={2} xl={3} className="g-4">
          {students.map(student => (
            <Col key={student.id}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 18, background: 'rgba(255,255,255,0.97)' }}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaUserGraduate size={28} className="me-2 text-primary" />
                    <div>
                      <div className="fw-bold" style={{ fontSize: 20 }}>{student.name}</div>
                      <div className="text-muted" style={{ fontSize: 15 }}>{student.email}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="fw-semibold mb-2" style={{ color: '#764ba2', fontSize: 15 }}>Enrolled Courses</div>
                    <div className="d-flex flex-wrap gap-2">
                      {getStudentCourses(student).length > 0 ? (
                        getStudentCourses(student).map(course => (
                          <span key={course.id || course} className="badge" style={{
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
                            color: '#764ba2',
                            fontWeight: 500,
                            fontSize: 14,
                            borderRadius: 8,
                            padding: '7px 14px',
                            border: '1px solid #d1c4e9',
                            boxShadow: '0 1px 4px rgba(102,126,234,0.07)'
                          }}>{course.name || course}</span>
                        ))
                      ) : (
                        <span className="text-muted">Not Enrolled in Any Courses</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Enroll in Course</Tooltip>}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openEnrollModal(student)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          fontWeight: 500,
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(102,126,234,0.10)'
                        }}
                      >
                        <FaPlus /> Enroll
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Enroll in All Courses</Tooltip>}>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleEnrollAll(student.id)}
                        style={{
                          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                          border: 'none',
                          fontWeight: 500,
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(72,187,120,0.10)'
                        }}
                      >
                        <FaPlus /> Enroll All
                      </Button>
                    </OverlayTrigger>
                  </div>
                  <div className="mt-3">
                    <div className="fw-semibold mb-1" style={{ color: '#764ba2', fontSize: 15 }}>Unenroll from Course</div>
                    <div className="d-flex flex-wrap gap-2">
                      {getStudentCourses(student).map(course => (
                        <OverlayTrigger key={course.id || course} placement="top" overlay={<Tooltip>Unenroll from {course.name || course}</Tooltip>}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleUnenroll(student.id, course.id || course)}
                            style={{
                              borderColor: '#dc3545',
                              color: '#dc3545',
                              borderRadius: 8,
                              padding: '4px 8px',
                              fontSize: 13,
                              background: 'rgba(220, 53, 69, 0.07)'
                            }}
                          >
                            <FaTrash />
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Enroll Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderBottom: 'none',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          <Modal.Title>Enroll Student in Course</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'rgba(255, 255, 255, 0.97)', borderRadius: 12 }}>
          <Form onSubmit={handleEnroll}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#2d3748', fontWeight: 500 }}>Student</Form.Label>
              <Form.Control
                type="text"
                value={selectedStudent?.name || ''}
                disabled
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 8
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#2d3748', fontWeight: 500 }}>Course</Form.Label>
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                style={{
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: 'none',
                  color: '#764ba2',
                  padding: '8px 16px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: 8
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  padding: '8px 16px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: 8
                }}
              >
                Enroll
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Students; 
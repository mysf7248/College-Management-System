import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '../../api/teacher';
import { FaBook, FaTasks, FaUsers, FaCalendarAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [editingAssignment, setEditingAssignment] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherApi.getMyCourses();
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      let errorMessage = 'Failed to fetch courses. ';
      if (err.response) {
        errorMessage += err.response.data?.message || `Server returned ${err.response.status}`;
      } else if (err.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await teacherApi.updateAssignment(editingAssignment.id, formData);
      } else {
        await teacherApi.createAssignment(selectedCourse.id, formData);
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError(err.response?.data?.message || 'Failed to save assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment? This will also delete all submissions and files associated with it.')) {
      try {
        setLoading(true);
        setError(null);
        await teacherApi.deleteAssignment(assignmentId);
        await fetchCourses();
      } catch (err) {
        console.error('Error deleting assignment:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to delete assignment. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    );
  }

  return (
    <div className="container-fluid px-4 py-4" style={{ 
      background: 'linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)',
      minHeight: '100vh'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ 
          color: '#2d3748',
          fontWeight: '600',
          margin: 0
        }}>My Courses</h2>
        <Button 
          variant="primary"
          onClick={() => navigate('/teacher/assignments')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px'
          }}
        >
          <FaTasks className="me-2" />
          Manage All Assignments
        </Button>
      </div>

      <Row>
        {courses.map(course => (
          <Col key={course.id} md={12} lg={12} className="mb-4">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title mb-1" style={{ color: '#2d3748' }}>{course.name}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{course.description}</p>
                  </div>
                  <Badge 
                    bg="light" 
                    text="dark"
                    style={{ 
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#764ba2',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    {course.assignments?.length || 0} Assignments
                  </Badge>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setEditingAssignment(null);
                      setFormData({ title: '', description: '', dueDate: '' });
                      setShowModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px'
                    }}
                  >
                    <FaPlus className="me-1" />
                    New Assignment
                  </Button>
                </div>

                <div className="mt-3">
                  <h6 className="mb-2" style={{ color: '#4a5568' }}>Assignments</h6>
                  <Row className="g-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {course.assignments?.map(assignment => (
                      <Col key={assignment.id} md={6}>
                        <ListGroup.Item 
                          className="border-0 px-0"
                          style={{ 
                            background: 'transparent',
                            borderBottom: '1px solid rgba(0,0,0,0.05) !important'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{assignment.title}</h6>
                              <small className="text-muted">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </small>
                            </div>
                            <div>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-primary p-0 me-2"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setEditingAssignment(assignment);
                                  setFormData({
                                    title: assignment.title,
                                    description: assignment.description,
                                    dueDate: new Date(assignment.dueDate).toISOString().split('T')[0]
                                  });
                                  setShowModal(true);
                                }}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-danger p-0 ms-2"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        </ListGroup.Item>
                      </Col>
                    ))}
                    {(!course.assignments || course.assignments.length === 0) && (
                      <Col md={12}>
                        <ListGroup.Item className="border-0 px-0 text-muted" style={{ background: 'transparent' }}>
                          No assignments yet
                        </ListGroup.Item>
                      </Col>
                    )}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px'
        }}>
          <Modal.Title>
            {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ borderColor: '#667eea' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                style={{ borderColor: '#667eea' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                style={{ borderColor: '#667eea' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => setShowModal(false)}
                style={{
                  borderRadius: '8px',
                  padding: '8px 16px'
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px'
                }}
              >
                {editingAssignment ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyCourses;
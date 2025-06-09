import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Card, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/courses');
      console.log('Courses response:', response.data);
      if (Array.isArray(response.data)) {
      setCourses(response.data);
      } else {
        setCourses([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again later.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers');
      console.log('Teachers response:', response.data);
      if (Array.isArray(response.data)) {
      setTeachers(response.data);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        alert('Course name is required');
        return;
      }

      const courseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        teacher: formData.teacherId ? { id: parseInt(formData.teacherId) } : null
      };

      let response;
      if (editingCourse) {
        response = await axios.put(`/courses/${editingCourse.id}`, courseData);
      } else {
        response = await axios.post('/courses', courseData);
      }

      setShowModal(false);
      fetchCourses();
      resetForm();
    } catch (err) {
      console.error('Error saving course:', err);
      alert(err.response?.data || 'Error saving course. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course? This will also remove all assignments associated with it.')) {
      try {
        await axios.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err) {
        console.error('Error deleting course:', err);
        let errorMessage;
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 404) {
            errorMessage = 'Course not found. It may have been already deleted.';
          } else if (err.response.status === 403) {
            errorMessage = 'You do not have permission to delete this course.';
          } else if (err.response.data && err.response.data.includes('students enrolled')) {
            errorMessage = 'Cannot delete this course because there are students enrolled in it. Please unenroll all students first.';
          } else {
            errorMessage = err.response.data || `Server returned ${err.response.status}`;
          }
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = err.message;
        }
        
        alert(errorMessage);
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description || '',
      teacherId: course.teacher ? course.teacher.id : ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      teacherId: ''
    });
    setEditingCourse(null);
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <FaBook size={24} className="text-primary me-2" style={{ color: '#764ba2' }} />
          <h2 className="mb-0" style={{ color: '#2d3748', fontWeight: '600' }}>Manage Courses</h2>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '8px 16px'
          }}
        >
          <FaPlus size={12} className="me-1" />
          Add Course
        </Button>
      </div>

      <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
      <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          ) : courses.length === 0 ? (
            <Alert variant="info" className="mt-3">
              No courses found.
            </Alert>
        ) : (
            <div className="table-responsive">
              <Table hover className="align-middle" style={{
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                width: '100%'
              }}>
          <thead>
            <tr>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none',
                      borderRadius: '8px 0 0 8px'
                    }}>Name</th>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none'
                    }}>Description</th>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none'
                    }}>Teacher</th>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none',
                      borderRadius: '0 8px 8px 0'
                    }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
                    <tr key={course.id} style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      borderRadius: '8px',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                    }}>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0',
                        borderLeft: '1px solid #f0f0f0',
                        borderRadius: '8px 0 0 8px'
                      }}>{course.name}</td>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>{course.description}</td>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        {course.teacher ? (
                          <span className="badge bg-light text-dark" style={{ 
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#764ba2',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}>
                            {course.teacher.name}
                          </span>
                        ) : 'Not Assigned'}
                      </td>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0',
                        borderRight: '1px solid #f0f0f0',
                        borderRadius: '0 8px 8px 0'
                      }}>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2" 
                          onClick={() => handleEdit(course)}
                          style={{ 
                            borderColor: '#667eea', 
                            color: '#667eea',
                            padding: '4px 8px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <FaEdit size={12} />
                  </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(course.id)}
                          style={{ 
                            borderColor: '#dc3545', 
                            color: '#dc3545',
                            padding: '4px 8px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <FaTrash size={12} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
            </div>
        )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} centered>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
            <Modal.Title>{editingCourse ? 'Edit Course' : 'Add Course'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                style={{ borderColor: '#667eea' }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teacher</Form.Label>
                <Form.Select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                style={{ borderColor: '#667eea' }}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => { setShowModal(false); resetForm(); }}
                style={{ border: 'none', background: '#e2e8f0' }}
              >
                  Cancel
                </Button>
              <Button 
                variant="primary" 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                  {editingCourse ? 'Update' : 'Add'} Course
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
    </div>
  );
};

export default Courses;
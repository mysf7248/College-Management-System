import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, ListGroup, Badge, Table } from 'react-bootstrap';
import { teacherApi } from '../../api/teacher';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';

const ManageAssignments = () => {
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses...');
      const response = await teacherApi.getMyCourses();
      console.log('Courses response:', response.data);
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      console.log('Fetching submissions for assignment:', assignmentId);
      const response = await teacherApi.getAssignmentSubmissions(assignmentId);
      console.log('Submissions response:', response.data);
      setSubmissions(response.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Initial load - fetching courses');
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      console.log('Selected assignment changed:', selectedAssignment);
      fetchSubmissions(selectedAssignment.id);
    }
  }, [selectedAssignment]);

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.dueDate) {
        throw new Error('Due date is required');
      }

      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: new Date(formData.dueDate).toISOString().split('T')[0]
      };

      if (editingAssignment) {
        await teacherApi.updateAssignment(editingAssignment.id, formattedData);
      } else {
        await teacherApi.createAssignment(selectedCourse.id, formattedData);
      }

      setShowModal(false);
      setFormData({ title: '', description: '', dueDate: '' });
      setEditingAssignment(null);
      await fetchCourses();
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to save assignment. Please try again.'
      );
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setSelectedCourse(courses.find(course => 
      course.assignments.some(a => a.id === assignment.id)
    ));
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: new Date(assignment.dueDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await teacherApi.deleteAssignment(assignmentId);
        await fetchCourses();
        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(null);
          setSubmissions([]);
        }
      } catch (err) {
        console.error('Error deleting assignment:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to delete assignment. Please try again.'
        );
      }
    }
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      if (!grade || grade < 0 || grade > 100) {
        throw new Error('Grade must be between 0 and 100');
      }
      await teacherApi.gradeSubmission(submissionId, parseFloat(grade));
      await fetchSubmissions(selectedAssignment.id);
      setShowGradeModal(false);
      setGradeData({ grade: '', feedback: '' });
    } catch (err) {
      console.error('Error grading submission:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to grade submission. Please try again.'
      );
    }
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({ grade: '', feedback: '' });
    setShowGradeModal(true);
  };

  const getAssignmentStats = (assignment) => {
    const totalSubmissions = assignment.submissions?.length || 0;
    const gradedSubmissions = assignment.submissions?.filter(s => s.grade !== null).length || 0;
    const pendingSubmissions = totalSubmissions - gradedSubmissions;
    
    return {
      total: totalSubmissions,
      graded: gradedSubmissions,
      pending: pendingSubmissions
    };
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleCloseModal = () => {
    setShowSubmissionModal(false);
    setSelectedSubmission(null);
  };

  const handleDownloadFile = async (submissionId) => {
    try {
      const response = await axios.get(`/teacher/submissions/${submissionId}/file`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submission_${submissionId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download file');
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Manage Assignments</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Assignments Overview</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {courses.map(course => (
                  <React.Fragment key={course.id}>
                    <ListGroup.Item className="bg-light">
                      <strong>{course.name}</strong>
                    </ListGroup.Item>
                    {course.assignments?.map(assignment => {
                      const stats = getAssignmentStats(assignment);
                      return (
                        <ListGroup.Item 
                          key={assignment.id}
                          action
                          active={selectedAssignment?.id === assignment.id}
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{assignment.title}</strong>
                              <br />
                              <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                            </div>
                            <div className="text-end">
                              <Badge bg="success" className="me-1">{stats.graded}</Badge>
                              <Badge bg="warning" className="me-1">{stats.pending}</Badge>
                              <Badge bg="info">{stats.total}</Badge>
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </React.Fragment>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {selectedAssignment ? (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{selectedAssignment.title}</h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditAssignment(selectedAssignment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteAssignment(selectedAssignment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <p>{selectedAssignment.description}</p>
                <p><strong>Due Date:</strong> {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                
                <h6 className="mt-4">Submissions</h6>
                {submissions.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Grade</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map(submission => (
                        <tr key={submission.id}>
                          <td>{submission.student?.name || 'Unknown Student'}</td>
                          <td>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}</td>
                          <td>
                            <Badge bg={submission.grade ? 'success' : 'warning'}>
                              {submission.grade ? 'Graded' : 'Pending'}
                            </Badge>
                          </td>
                          <td>{submission.grade || '-'}</td>
                          <td>
                            {submission.submissionText && (
                              <Button
                                variant="info"
                                size="sm"
                                className="me-2"
                                onClick={() => handleViewSubmission(submission)}
                              >
                                View Submission
                              </Button>
                            )}
                            {submission.fileUrl && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleDownloadFile(submission.id)}
                              >
                                Download File
                              </Button>
                            )}
                            {!submission.grade ? (
                              <Button 
                                variant="primary"
                                size="sm"
                                onClick={() => openGradeModal(submission)}
                              >
                                Grade
                              </Button>
                            ) : (
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => openGradeModal(submission)}
                              >
                                Update Grade
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    No submissions have been made for this assignment yet.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center">
                <p className="text-muted">Select an assignment to view details and manage submissions</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showGradeModal} onHide={() => {
        setShowGradeModal(false);
        setSelectedSubmission(null);
        setGradeData({ grade: '', feedback: '' });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Grade Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Grade (0-100)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={gradeData.grade}
                onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={gradeData.feedback}
                onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                placeholder="Enter feedback for the student"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowGradeModal(false);
            setSelectedSubmission(null);
            setGradeData({ grade: '', feedback: '' });
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleGradeSubmission(selectedSubmission.id, gradeData.grade, gradeData.feedback)}>
            Submit Grade
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingAssignment(null);
        setFormData({ title: '', description: '', dueDate: '' });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAssignment ? 'Edit Assignment' : 'Create Assignment'} for {selectedCourse?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveAssignment}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter assignment title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Enter assignment description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Submission Text Modal */}
      <Modal show={showSubmissionModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Submission from {selectedSubmission?.student?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Submission Text:</h6>
            <div className="p-3 bg-light rounded">
              {selectedSubmission?.submissionText || 'No submission text provided'}
            </div>
          </div>
          {selectedSubmission?.feedback && (
            <div>
              <h6>Feedback:</h6>
              <div className="p-3 bg-light rounded">
                {selectedSubmission.feedback}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageAssignments; 
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { teacherApi } from '../../api/teacher';

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

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
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment.id);
    }
  }, [selectedAssignment]);

  const handleGradeSubmission = async () => {
    try {
      if (!gradeData.grade || gradeData.grade < 0 || gradeData.grade > 100) {
        throw new Error('Grade must be between 0 and 100');
      }
      await teacherApi.gradeSubmission(
        selectedSubmission.id,
        parseFloat(gradeData.grade),
        gradeData.feedback
      );
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
    setGradeData({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
    setShowGradeModal(true);
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
      <h2 className="mb-4">Manage Grades</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Courses</h5>
            </Card.Header>
            <Card.Body>
              {courses.map(course => (
                <div key={course.id} className="mb-3">
                  <h6>{course.name}</h6>
                  <div className="ms-3">
                    {course.assignments?.map(assignment => (
                      <div
                        key={assignment.id}
                        className={`p-2 mb-1 rounded cursor-pointer ${
                          selectedAssignment?.id === assignment.id ? 'bg-primary text-white' : 'bg-light'
                        }`}
                        onClick={() => setSelectedAssignment(assignment)}
                        style={{ cursor: 'pointer' }}
                      >
                        {assignment.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {selectedAssignment ? (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  {selectedAssignment.title} - Submissions
                </h5>
              </Card.Header>
              <Card.Body>
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
                          <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                          <td>
                            <Badge bg={submission.grade ? 'success' : 'warning'}>
                              {submission.grade ? 'Graded' : 'Pending'}
                            </Badge>
                          </td>
                          <td>{submission.grade || '-'}</td>
                          <td>
                            <Button
                              variant={submission.grade ? 'outline-primary' : 'primary'}
                              size="sm"
                              onClick={() => openGradeModal(submission)}
                            >
                              {submission.grade ? 'Update Grade' : 'Grade'}
                            </Button>
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
                <p className="text-muted">
                  Select an assignment to view and manage submissions
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        show={showGradeModal}
        onHide={() => {
          setShowGradeModal(false);
          setSelectedSubmission(null);
          setGradeData({ grade: '', feedback: '' });
        }}
      >
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
                onChange={(e) =>
                  setGradeData({ ...gradeData, grade: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={gradeData.feedback}
                onChange={(e) =>
                  setGradeData({ ...gradeData, feedback: e.target.value })
                }
                placeholder="Enter feedback for the student"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowGradeModal(false);
              setSelectedSubmission(null);
              setGradeData({ grade: '', feedback: '' });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGradeSubmission}>
            Save Grade
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Grades; 
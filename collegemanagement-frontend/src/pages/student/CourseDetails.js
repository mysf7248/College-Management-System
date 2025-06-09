import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { studentApi } from '../../api/student';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get course details
      const courseResponse = await studentApi.getCourseDetails(courseId);
      if (!courseResponse.data) {
        throw new Error('No course data received');
      }
      setCourse(courseResponse.data);

      // Get assignments for this course
      const assignmentsResponse = await studentApi.getCourseAssignments(courseId);
      if (!assignmentsResponse.data) {
        throw new Error('No assignments data received');
      }
      setAssignments(assignmentsResponse.data);
    } catch (err) {
      console.error('Error fetching course data:', err);
      let errorMessage = 'Failed to load course data. ';
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = 'You are not enrolled in this course.';
        } else {
          errorMessage += err.response.data || `Server returned ${err.response.status}`;
        }
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

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="mt-3">
        <Alert variant="warning">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Header>
          <h3>{course.name}</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Card.Text>{course.description}</Card.Text>
            </Col>
            <Col md={4}>
              <Card className="bg-light">
                <Card.Body>
                  <h5>Course Information</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Teacher:</strong> {course.teacher?.name || 'Not assigned'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Total Assignments:</strong> {assignments.length}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Teacher Email:</strong> {course.teacher?.email || 'N/A'}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h4>Course Assignments</h4>
        </Card.Header>
        <Card.Body>
          {assignments.length === 0 ? (
            <Alert variant="info">No assignments have been posted yet.</Alert>
          ) : (
            <ListGroup>
              {assignments.map(assignment => (
                <ListGroup.Item key={assignment.id}>
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{assignment.title}</h5>
                      <p className="mb-1">{assignment.description}</p>
                      <small className="text-muted">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </small>
                    </div>
                    <Link
                      to={`/student/assignments/${assignment.id}`}
                      className="btn btn-primary"
                    >
                      View Assignment
                    </Link>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseDetails; 
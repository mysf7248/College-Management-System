import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { studentApi } from '../../api/student';
import { FaBook, FaCheckCircle, FaClipboardList, FaStar, FaGraduationCap } from 'react-icons/fa';

const accentGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const accentColor = '#667eea';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [gradesFeedback, setGradesFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const location = useLocation();
  const tabRefs = {
    pending: useRef(null),
    submitted: useRef(null),
    grades: useRef(null)
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch courses, all submissions, and assignments
      const [coursesResponse, submissionsResponse] = await Promise.all([
        studentApi.getMyCourses(),
        studentApi.getMySubmissions()
      ]);
      const coursesData = coursesResponse.data;
      const submissions = submissionsResponse.data;

      // Get all assignments from all courses
      const allAssignments = [];
      for (const course of coursesData) {
        const assignmentsResponse = await studentApi.getCourseAssignments(course.id);
        const assignments = assignmentsResponse.data;
        assignments.forEach(assignment => {
          assignment.courseName = course.name;
          assignment.courseId = course.id;
        });
        allAssignments.push(...assignments);
      }

      // Map: assignmentId -> submission
      const submissionMap = {};
      submissions.forEach(sub => {
        if (sub.assignment && sub.assignment.id) {
          submissionMap[sub.assignment.id] = sub;
        }
      });

      // Pending assignments: no submission
      const pending = allAssignments.filter(a => !submissionMap[a.id]);
      // Submitted assignments: has submission
      const submitted = allAssignments.filter(a => submissionMap[a.id]).map(a => {
        const sub = submissionMap[a.id];
        return {
          ...a,
          submissionDate: sub.submittedAt || sub.submissionDateTime,
          status: sub.status,
          grade: sub.grade,
          feedback: sub.feedback
        };
      });
      // Grades & Feedback: only those with grade
      const graded = submitted.filter(a => a.grade !== null && a.grade !== undefined);

      setCourses(coursesData);
      setAllAssignments(allAssignments);
      setPendingAssignments(pending);
      setSubmittedAssignments(submitted);
      setGradesFeedback(graded);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const handleAssignmentSubmitted = () => {
      fetchDashboardData();
    };
    window.addEventListener('assignmentSubmitted', handleAssignmentSubmitted);
    return () => {
      window.removeEventListener('assignmentSubmitted', handleAssignmentSubmitted);
    };
  }, []);

  // Handle anchor navigation from navbar
  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace('#', '');
      if (['pending', 'submitted', 'grades'].includes(tab)) {
        setActiveTab(tab);
        setTimeout(() => {
          tabRefs[tab]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
    // eslint-disable-next-line
  }, [location.hash]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" style={{ color: accentColor }}>
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

  return (
    <Container className="py-4">
      <div
        className="rounded shadow mb-4 px-4 py-4 d-flex align-items-center justify-content-between"
        style={{ background: accentGradient, color: 'white', minHeight: 120 }}
      >
        <div>
          <h2 style={{ fontWeight: 700, letterSpacing: 1 }}>Welcome to Your Student Dashboard</h2>
          <div style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Manage your courses, assignments, and track your academic progress.
          </div>
        </div>
        <FaGraduationCap size={60} style={{ opacity: 0.2 }} />
      </div>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="mb-3 border-0 shadow-sm" style={{ background: accentGradient, color: 'white', borderRadius: 16 }}>
            <Card.Body className="d-flex align-items-center">
              <FaBook size={36} className="me-3" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Enrolled Courses</div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{courses.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white', borderRadius: 16 }}>
            <Card.Body className="d-flex align-items-center">
              <FaClipboardList size={36} className="me-3" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Pending Assignments</div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{pendingAssignments.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #38b2ac 0%, #3182ce 100%)', color: 'white', borderRadius: 16 }}>
            <Card.Body className="d-flex align-items-center">
              <FaCheckCircle size={36} className="me-3" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Submitted Assignments</div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{submittedAssignments.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        variant="pills"
        style={{ fontWeight: 600 }}
      >
        <Tab
          eventKey="pending"
          title={<span><FaClipboardList className="me-2" />Pending Assignments <Badge bg="warning" text="dark">{pendingAssignments.length}</Badge></span>}
          tabClassName="fw-bold"
        >
          <div ref={tabRefs.pending} />
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              {pendingAssignments.length === 0 ? (
                <Alert variant="success">No pending assignments!</Alert>
              ) : (
                <div className="list-group">
                  {pendingAssignments.map(assignment => (
                    <Link
                      key={assignment.id}
                      to={`/student/assignments/${assignment.id}`}
                      className="list-group-item list-group-item-action"
                      style={{ borderRadius: 10, marginBottom: 8, border: '1px solid #eee' }}
                    >
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1" style={{ fontWeight: 600 }}>{assignment.title}</h6>
                          <div className="text-muted" style={{ fontSize: 13 }}>{assignment.courseName}</div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <p className="mb-1" style={{ fontSize: 15 }}>{assignment.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab
          eventKey="submitted"
          title={<span><FaCheckCircle className="me-2" />Submitted <Badge bg="info">{submittedAssignments.length}</Badge></span>}
          tabClassName="fw-bold"
        >
          <div ref={tabRefs.submitted} />
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              {submittedAssignments.length === 0 ? (
                <Alert variant="info">No assignments submitted yet.</Alert>
              ) : (
                <Table striped bordered hover responsive className="align-middle">
                  <thead style={{ background: accentGradient, color: 'white' }}>
                    <tr>
                      <th>Title</th>
                      <th>Course</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedAssignments.map(a => (
                      <tr key={a.id}>
                        <td>{a.title}</td>
                        <td>{a.courseName}</td>
                        <td>{a.submissionDate ? new Date(a.submissionDate).toLocaleString() : '-'}</td>
                        <td><Badge bg="success">{a.status || 'Submitted'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab
          eventKey="grades"
          title={<span><FaStar className="me-2" />Grades & Feedback <Badge bg="primary">{gradesFeedback.length}</Badge></span>}
          tabClassName="fw-bold"
        >
          <div ref={tabRefs.grades} />
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              {gradesFeedback.length === 0 ? (
                <Alert variant="info">No grades or feedback yet.</Alert>
              ) : (
                <Table striped bordered hover responsive className="align-middle">
                  <thead style={{ background: accentGradient, color: 'white' }}>
                    <tr>
                      <th>Title</th>
                      <th>Course</th>
                      <th>Submission Date</th>
                      <th>Grade</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesFeedback.map(a => (
                      <tr key={a.id}>
                        <td>{a.title}</td>
                        <td>{a.courseName}</td>
                        <td>{a.submissionDate ? new Date(a.submissionDate).toLocaleString() : '-'}</td>
                        <td><Badge bg="primary" style={{ fontSize: 15 }}>{a.grade}</Badge></td>
                        <td>{a.feedback || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default StudentDashboard; 
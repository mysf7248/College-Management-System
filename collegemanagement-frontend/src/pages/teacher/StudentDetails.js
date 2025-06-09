import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';

const StudentDetails = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const [studentResponse, submissionsResponse] = await Promise.all([
        axios.get(`/teacher/students/${studentId}`),
        axios.get(`/teacher/students/${studentId}/submissions`)
      ]);
      setStudent(studentResponse.data);
      setSubmissions(submissionsResponse.data);
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'primary';
    if (grade >= 60) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Student Details</h2>

      {student && (
        <Card className="mb-4">
          <Card.Body>
            <h3>{student.name}</h3>
            <p className="text-muted">Email: {student.email}</p>
            <p>Student ID: {student.id}</p>
          </Card.Body>
        </Card>
      )}

      <h4 className="mb-3">Assignment Submissions</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Course</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Grade</th>
            <th>Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.assignment.title}</td>
              <td>{submission.assignment.course.name}</td>
              <td>{new Date(submission.submissionDateTime).toLocaleString()}</td>
              <td>
                <Badge bg={submission.status === 'GRADED' ? 'success' : 'warning'}>
                  {submission.status}
                </Badge>
              </td>
              <td>
                {submission.grade ? (
                  <Badge bg={getGradeColor(submission.grade)}>
                    {submission.grade}%
                  </Badge>
                ) : (
                  'Not Graded'
                )}
              </td>
              <td>{submission.feedback || 'No feedback provided'}</td>
              <td>
                {submission.fileUrl && (
                  <a
                    href={`/api/teacher/submissions/${submission.id}/file`}
                    className="btn btn-sm btn-primary me-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                )}
                {submission.status !== 'GRADED' && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => window.location.href = `/teacher/submissions/${submission.id}/grade`}
                  >
                    Grade
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentDetails; 
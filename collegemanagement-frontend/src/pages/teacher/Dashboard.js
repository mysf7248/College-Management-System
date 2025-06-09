import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaBook, FaTasks, FaGraduationCap, FaUsers, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teacher/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
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
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container-fluid px-4 py-4" style={{ 
      background: 'linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)',
      minHeight: '100vh'
    }}>
      <h2 className="mb-4" style={{ 
        color: '#2d3748',
        fontWeight: '600'
      }}>Teacher Dashboard</h2>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px'
          }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-2">Total Courses</h6>
                  <h2 className="mb-0">{stats.totalCourses}</h2>
                </div>
                <FaBook size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100" style={{ 
            background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
            borderRadius: '15px'
          }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-2">Total Assignments</h6>
                  <h2 className="mb-0">{stats.totalAssignments}</h2>
                </div>
                <FaTasks size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Access Cards */}
      <Row>
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaBook size={24} className="text-primary me-2" />
                <h5 className="card-title mb-0">My Courses</h5>
              </div>
              <p className="card-text text-muted">View and manage your assigned courses, create assignments, and track student progress.</p>
              <Link 
                to="/teacher/courses" 
                className="btn btn-primary w-100"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              >
                View Courses
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaTasks size={24} className="text-success me-2" />
                <h5 className="card-title mb-0">Assignments</h5>
              </div>
              <p className="card-text text-muted">Create new assignments, manage existing ones, and review student submissions.</p>
              <Link 
                to="/teacher/assignments" 
                className="btn btn-success w-100"
                style={{
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              >
                Manage Assignments
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaGraduationCap size={24} className="text-warning me-2" />
                <h5 className="card-title mb-0">Grades</h5>
              </div>
              <p className="card-text text-muted">Review and grade student submissions, provide feedback, and track academic progress.</p>
              <Link 
                to="/teacher/grades" 
                className="btn btn-warning w-100"
                style={{
                  background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  color: 'white'
                }}
              >
                Manage Grades
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard; 
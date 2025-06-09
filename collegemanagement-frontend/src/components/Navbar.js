import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FaUserGraduate, FaSignOutAlt, FaBook, FaTasks, FaGraduationCap, FaUserTie, FaCog, FaCheckCircle } from 'react-icons/fa';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleSpecificLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'ADMIN':
        return (
          <>
            <Nav.Link as={Link} to="/admin/dashboard" className="text-white py-1">
              <FaCog className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/students" className="text-white py-1">
              <FaUserGraduate className="me-1" /> Students
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/teachers" className="text-white py-1">
              <FaUserTie className="me-1" /> Teachers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/courses" className="text-white py-1">
              <FaBook className="me-1" /> Courses
            </Nav.Link>
          </>
        );
      case 'TEACHER':
        return (
          <>
            <Nav.Link as={Link} to="/teacher/dashboard" className="text-white py-1">
              <FaCog className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/teacher/courses" className="text-white py-1">
              <FaBook className="me-1" /> My Courses
            </Nav.Link>
            <Nav.Link as={Link} to="/teacher/assignments" className="text-white py-1">
              <FaTasks className="me-1" /> Assignments
            </Nav.Link>
            <Nav.Link as={Link} to="/teacher/grades" className="text-white py-1">
              <FaGraduationCap className="me-1" /> Grades
            </Nav.Link>
          </>
        );
      case 'STUDENT':
        return (
          <>
            <Nav.Link as={Link} to="/student/dashboard" className="text-white py-1">
              <FaCog className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/student/dashboard#pending" className="text-white py-1">
              <FaTasks className="me-1" /> Pending
            </Nav.Link>
            <Nav.Link as={Link} to="/student/dashboard#submitted" className="text-white py-1">
              <FaCheckCircle className="me-1" /> Submitted
            </Nav.Link>
            <Nav.Link as={Link} to="/student/dashboard#grades" className="text-white py-1">
              <FaGraduationCap className="me-1" /> Grades
            </Nav.Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Navbar 
      expand="lg" 
      className="py-2"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{ color: 'white' }}>
          <FaUserGraduate size={35} className="me-2" />
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CDAC MUMBAI
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255,255,255,0.5)' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/" className="text-white py-1">Home</Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-white py-1">About Us</Nav.Link>
                <Nav.Link as={Link} to="/contact" className="text-white py-1">Contact</Nav.Link>
              </>
            )}
            {user && (
              <>
                {getRoleSpecificLinks()}
                <div className="d-flex align-items-center">
                  <span className="text-white me-2" style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    {user.name}
                  </span>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="d-flex align-items-center"
                    onClick={handleLogout}
                    style={{
                      border: '1px solid rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </Button>
                </div>
              </>
            )}
            {!user && (
              <Button 
                as={Link} 
                to="/login" 
                variant="light" 
                size="sm"
                className="ms-2"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  fontWeight: '500'
                }}
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
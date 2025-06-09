import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';
import { FaUsers, FaChalkboardTeacher, FaBook, FaUserGraduate, FaUserTie, FaBookOpen } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchDashboardStats();
    }
  }, [user, token]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('Dashboard stats:', response.data);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard statistics. Please try again.');
      setStats({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-link" onClick={fetchDashboardStats}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0" style={{ 
          color: '#2d3748',
          fontWeight: '600'
        }}>
          Welcome, {user?.name}
        </h2>
        <div className="text-muted">
          Admin Dashboard
        </div>
      </div>

      {stats && (
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px'
            }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-2">Total Students</h6>
                    <h2 className="mb-0">{stats.totalStudents}</h2>
                  </div>
                  <FaUserGraduate size={40} className="opacity-50" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ 
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
              borderRadius: '15px'
            }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-2">Total Teachers</h6>
                    <h2 className="mb-0">{stats.totalTeachers}</h2>
                  </div>
                  <FaChalkboardTeacher size={40} className="opacity-50" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px'
            }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-2">Total Courses</h6>
                    <h2 className="mb-0">{stats.totalCourses}</h2>
                  </div>
                  <FaBook size={40} className="opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FaUserGraduate size={24} className="text-primary me-2" />
                <h5 className="card-title mb-0">Manage Students</h5>
              </div>
              <p className="card-text text-muted">View and manage student accounts, enrollments, and academic records.</p>
              <button 
                className="btn btn-primary w-100"
                onClick={() => handleNavigation('/admin/students')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              >
                Manage Students
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FaUserTie size={24} className="text-primary me-2" />
                <h5 className="card-title mb-0">Manage Teachers</h5>
              </div>
              <p className="card-text text-muted">View and manage teacher accounts, course assignments, and schedules.</p>
              <button 
                className="btn btn-primary w-100"
                onClick={() => handleNavigation('/admin/teachers')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              >
                Manage Teachers
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FaBookOpen size={24} className="text-primary me-2" />
                <h5 className="card-title mb-0">Manage Courses</h5>
              </div>
              <p className="card-text text-muted">Create, update, and manage courses, assignments, and academic content.</p>
              <button 
                className="btn btn-primary w-100"
                onClick={() => handleNavigation('/admin/courses')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              >
                Manage Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
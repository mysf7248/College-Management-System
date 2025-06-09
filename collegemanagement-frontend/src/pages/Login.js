import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FaEnvelope, FaLock, FaUserGraduate } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login with:', formData);
      const response = await login(formData.email, formData.password);
      console.log('Login response:', response);
      
      // Navigate based on role
      switch(response.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'TEACHER':
          navigate('/teacher/dashboard');
          break;
        case 'STUDENT':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="login-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="login-container" style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <div className="text-center mb-4">
          <FaUserGraduate size={50} className="text-primary mb-3" />
          <h2 className="fw-bold" style={{ color: '#333' }}>Welcome Back</h2>
          <p className="text-muted">Please login to your account</p>
        </div>

              {error && (
          <div className="alert alert-danger" role="alert" style={{ borderRadius: '10px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text" style={{ 
                background: 'transparent', 
                borderRight: 'none',
                borderColor: '#ddd'
              }}>
                <FaEnvelope className="text-primary" />
              </span>
                  <input
                    type="email"
                    className="form-control"
                placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                style={{
                  borderLeft: 'none',
                  padding: '12px',
                  borderRadius: '0 10px 10px 0',
                  borderColor: '#ddd'
                }}
                  />
                </div>
          </div>

          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text" style={{ 
                background: 'transparent', 
                borderRight: 'none',
                borderColor: '#ddd'
              }}>
                <FaLock className="text-primary" />
              </span>
                  <input
                    type="password"
                    className="form-control"
                placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                style={{
                  borderLeft: 'none',
                  padding: '12px',
                  borderRadius: '0 10px 10px 0',
                  borderColor: '#ddd'
                }}
                  />
                </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3"
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}
          >
                  Login
                </button>

                <div className="text-center">
            <p className="mb-0" style={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
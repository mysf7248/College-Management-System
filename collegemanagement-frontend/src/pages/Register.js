import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FaEnvelope, FaLock, FaUser, FaUserGraduate } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response?.status === 409) {
        setError('This email is already registered. Please use a different email or try logging in.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="register-container" style={{
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <div className="text-center mb-4">
          <FaUserGraduate size={50} className="text-primary mb-3" />
          <h2 className="fw-bold" style={{ color: '#333' }}>Create Account</h2>
          <p className="text-muted">Join CDAC Mumbai today</p>
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
                <FaUser className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
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

          <div className="mb-4">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{
                padding: '12px',
                borderRadius: '10px',
                borderColor: '#ddd'
              }}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
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
            Register
          </button>

          <div className="text-center">
            <p className="mb-0" style={{ color: '#666' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 
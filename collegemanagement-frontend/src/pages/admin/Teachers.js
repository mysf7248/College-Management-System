import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import { FaChalkboardTeacher } from 'react-icons/fa';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/teachers');
      console.log('Teachers response:', response.data);
      if (Array.isArray(response.data)) {
      setTeachers(response.data);
      } else {
        setTeachers([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to fetch teachers. Please try again later.');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="container-fluid px-4 py-4" style={{ 
      background: 'linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)',
      minHeight: '100vh'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '12px',
            borderRadius: '12px',
            marginRight: '16px'
          }}>
            <FaChalkboardTeacher size={24} className="text-white" />
          </div>
          <h2 className="mb-0" style={{ 
            color: '#2d3748', 
            fontWeight: '600',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Manage Teachers</h2>
        </div>
      </div>

      <Card className="border-0" style={{ 
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
          ) : teachers.length === 0 ? (
            <Alert variant="info" className="mt-3">
              No teachers found.
            </Alert>
        ) : (
            <div className="table-responsive">
              <Table hover className="align-middle" style={{
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                width: '100%'
              }}>
          <thead>
            <tr>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none',
                      borderRadius: '8px 0 0 8px',
                      fontWeight: '500'
                    }}>Name</th>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none',
                      fontWeight: '500'
                    }}>Email</th>
                    <th style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px',
                      border: 'none',
                      borderRadius: '0 8px 8px 0',
                      fontWeight: '500'
                    }}>Courses</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
                    <tr key={teacher.id} style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(5px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                        borderLeft: '1px solid rgba(102, 126, 234, 0.1)',
                        borderRadius: '8px 0 0 8px',
                        color: '#2d3748',
                        fontWeight: '500'
                      }}>{teacher.name}</td>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                        color: '#4a5568'
                      }}>{teacher.email}</td>
                      <td style={{
                        padding: '16px',
                        border: 'none',
                        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                        borderRight: '1px solid rgba(102, 126, 234, 0.1)',
                        borderRadius: '0 8px 8px 0'
                      }}>
                  {Array.isArray(teacher.coursesTaught) && teacher.coursesTaught.length > 0
                          ? teacher.coursesTaught.map(course => (
                              <span 
                                key={course.id} 
                                className="badge bg-light text-dark me-2 mb-1" 
                                style={{ 
                                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                  color: '#764ba2',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.85rem',
                                  fontWeight: '500',
                                  border: '1px solid rgba(102, 126, 234, 0.2)',
                                  display: 'inline-block'
                                }}
                              >
                                {course.name}
                              </span>
                            ))
                    : 'Not Assigned Any Courses'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
            </div>
        )}
      </Card.Body>
    </Card>
    </div>
  );
};

export default Teachers; 
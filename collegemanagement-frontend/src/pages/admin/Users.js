import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Users data:', response.data);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-link" onClick={fetchUsers}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
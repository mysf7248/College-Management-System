import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-4">401</h1>
          <h2>Unauthorized Access</h2>
          <p className="lead">You don't have permission to access this page.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 
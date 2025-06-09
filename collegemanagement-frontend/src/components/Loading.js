import React from 'react';
import { Container } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <ClipLoader
        color="#0d6efd"
        loading={true}
        size={50}
        aria-label="Loading Spinner"
      />
    </Container>
  );
};

export default Loading;
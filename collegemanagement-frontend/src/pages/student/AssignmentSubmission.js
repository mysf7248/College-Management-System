import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/student';
import { toast } from 'react-toastify';

const AssignmentSubmission = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState({
        submissionText: '',
        file: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignmentDetails();
    }, [assignmentId]);

    const fetchAssignmentDetails = async () => {
        try {
            setLoading(true);
            const response = await studentApi.getAssignmentDetails(assignmentId);
            setAssignment(response.data);
        } catch (err) {
            console.error('Error fetching assignment details:', err);
            setError('Failed to load assignment details');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (e) => {
        setSubmission(prev => ({
            ...prev,
            submissionText: e.target.value
        }));
    };

    const handleFileChange = (e) => {
        setSubmission(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!submission.submissionText && !submission.file) {
            toast.error('Please provide either text submission or upload a file');
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            if (submission.submissionText) {
                formData.append('submissionText', submission.submissionText);
            }
            if (submission.file) {
                formData.append('file', submission.file);
            }

            await studentApi.submitAssignment(assignmentId, formData);
            toast.success('Assignment submitted successfully!');
            navigate('/student/dashboard');
        } catch (err) {
            console.error('Error submitting assignment:', err);
            toast.error(err.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-3">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h3>Submit Assignment: {assignment?.title}</h3>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <h5>Assignment Details</h5>
                        <p><strong>Course:</strong> {assignment?.course?.name}</p>
                        <p><strong>Due Date:</strong> {new Date(assignment?.dueDate).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {assignment?.description}</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Submission Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={submission.submissionText}
                                onChange={handleTextChange}
                                placeholder="Enter your submission text here..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload File (Optional)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                            />
                            <Form.Text className="text-muted">
                                Supported formats: PDF, DOC, DOCX, TXT
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/student/dashboard')}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Assignment'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AssignmentSubmission; 
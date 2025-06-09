import axios from '../utils/axios';

export const studentApi = {
    getMyCourses: () => axios.get('/api/students/me/courses'),
    getCourseDetails: (courseId) => axios.get(`/api/students/me/courses/${courseId}`),
    getCourseAssignments: (courseId) => axios.get(`/api/students/me/courses/${courseId}/assignments`),
    getAssignmentDetails: async (assignmentId) => {
        return axios.get(`/api/students/assignments/${assignmentId}`);
    },
    submitAssignment: async (assignmentId, formData) => {
        return axios.post(`/api/students/assignments/${assignmentId}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getMySubmission: async (assignmentId) => {
        return axios.get(`/api/students/assignments/${assignmentId}/submission`);
    },
    getMySubmissionFile: async (assignmentId) => {
        return axios.get(`/api/students/assignments/${assignmentId}/submission/file`, {
            responseType: 'blob'
        });
    },
    getMyGrades: () => axios.get('/api/students/me/grades'),
    getMySubmissions: async () => {
        return axios.get('/api/students/me/submissions');
    }
}; 
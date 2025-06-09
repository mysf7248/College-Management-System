import api from './axios';

export const teacherApi = {
    getMyCourses: () => api.get('/teacher/courses'),
    getStudentsInCourse: (courseId) => api.get(`/teacher/courses/${courseId}/students`),
    createAssignment: (courseId, assignment) => api.post(`/teacher/courses/${courseId}/assignments`, assignment),
    getCourseAssignments: (courseId) => api.get(`/teacher/courses/${courseId}/assignments`),
    getAssignmentSubmissions: (assignmentId) => api.get(`/teacher/assignments/${assignmentId}/submissions`),
    gradeSubmission: (submissionId, grade, feedback) => api.post(`/teacher/submissions/${submissionId}/grade`, null, {
        params: { grade, feedback }
    }),
    updateAssignment: (assignmentId, assignment) => api.put(`/teacher/assignments/${assignmentId}`, assignment),
    deleteAssignment: (assignmentId) => api.delete(`/teacher/assignments/${assignmentId}`),
    downloadSubmissionFile: (submissionId) => api.get(`/teacher/submissions/${submissionId}/file`, {
        responseType: 'blob'
    })
}; 
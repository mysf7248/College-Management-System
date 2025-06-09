import api from './axios';

export const adminApi = {
    getDashboardStats: () => api.get('/admin/dashboard'),
    getAllTeachers: () => api.get('/admin/teachers'),
    getAllStudents: () => api.get('/admin/students'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    createCourse: (course) => api.post('/admin/courses', course),
    updateCourse: (id, course) => api.put(`/admin/courses/${id}`, course),
    deleteCourse: (id) => api.delete(`/admin/courses/${id}`)
}; 
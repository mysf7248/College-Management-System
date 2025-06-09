import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students';

export const getGrades = async (studentId, token) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/grades`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching grades:', error);
        throw error;
    }
};

export const getEnrolledCourses = async (studentId, token) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        throw error;
    }
};

export const getDashboardData = async (studentId, token) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}; 
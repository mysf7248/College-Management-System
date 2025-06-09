import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getDashboardData, getGrades, getEnrolledCourses } from '../../services/student';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDashboardData(user.id, token);
      console.log('Dashboard data:', data);
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const grades = await getGrades(user.id, token);
      console.log('Grades data:', grades);
      return grades;
    } catch (err) {
      console.error('Error fetching grades:', err);
      return [];
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const courses = await getEnrolledCourses(user.id, token);
      console.log('Enrolled courses data:', courses);
      return courses;
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      return [];
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Student Dashboard</h2>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Enrolled Courses</h4>
            </div>
            <div className="card-body">
              {dashboardData?.enrolledCourses?.length > 0 ? (
                <ul className="list-group">
                  {dashboardData.enrolledCourses.map(course => (
                    <li key={course.id} className="list-group-item">
                      {course.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No courses enrolled</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Upcoming Assignments</h4>
            </div>
            <div className="card-body">
              {dashboardData?.upcomingAssignments?.length > 0 ? (
                <ul className="list-group">
                  {dashboardData.upcomingAssignments.map(assignment => (
                    <li key={assignment.id} className="list-group-item">
                      {assignment.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming assignments</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Recent Grades</h4>
            </div>
            <div className="card-body">
              {dashboardData?.recentGrades?.length > 0 ? (
                <ul className="list-group">
                  {dashboardData.recentGrades.map(submission => (
                    <li key={submission.id} className="list-group-item">
                      {submission.assignment.title}: {submission.grade}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent grades</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
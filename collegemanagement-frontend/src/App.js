import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './components/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Students from './pages/admin/Students';
import Teachers from './pages/admin/Teachers';
import Courses from './pages/admin/Courses';
import SystemSettings from './pages/admin/SystemSettings';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import MyCourses from './pages/teacher/MyCourses';
import ManageAssignments from './pages/teacher/ManageAssignments';
import Grades from './pages/teacher/Grades';
import StudentDetails from './pages/teacher/StudentDetails';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import AssignmentSubmission from './pages/student/AssignmentSubmission';
import CourseDetails from './pages/student/CourseDetails';

import { useAuth } from './auth/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Layout component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAuthPage && <NavigationBar />}
      <main className="flex-grow-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute roles={['ADMIN']}>
              <Users />
            </PrivateRoute>
          } />
          <Route path="/admin/students" element={
            <PrivateRoute roles={['ADMIN']}>
              <Students />
            </PrivateRoute>
          } />
          <Route path="/admin/teachers" element={
            <PrivateRoute roles={['ADMIN']}>
              <Teachers />
            </PrivateRoute>
          } />
          <Route path="/admin/courses" element={
            <PrivateRoute roles={['ADMIN']}>
              <Courses />
            </PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute roles={['ADMIN']}>
              <SystemSettings />
            </PrivateRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <PrivateRoute roles={['TEACHER']}>
              <TeacherDashboard />
            </PrivateRoute>
          } />
          <Route path="/teacher/courses" element={
            <PrivateRoute roles={['TEACHER']}>
              <MyCourses />
            </PrivateRoute>
          } />
          <Route path="/teacher/assignments" element={
            <PrivateRoute roles={['TEACHER']}>
              <ManageAssignments />
            </PrivateRoute>
          } />
          <Route path="/teacher/grades" element={
            <PrivateRoute roles={['TEACHER']}>
              <Grades />
            </PrivateRoute>
          } />
            <Route path="/teacher/students/:id" element={
              <PrivateRoute roles={['TEACHER']}>
                <StudentDetails />
              </PrivateRoute>
            } />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <PrivateRoute roles={['STUDENT']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
            <Route path="/student/assignments/:assignmentId" element={
              <PrivateRoute roles={['STUDENT']}>
                <AssignmentSubmission />
              </PrivateRoute>
            } />
            <Route path="/student/courses/:id" element={
            <PrivateRoute roles={['STUDENT']}>
              <CourseDetails />
            </PrivateRoute>
          } />
          
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
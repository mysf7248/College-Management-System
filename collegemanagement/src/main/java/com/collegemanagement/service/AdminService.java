package com.collegemanagement.service;

import com.collegemanagement.model.User;
import com.collegemanagement.model.Course;
import com.collegemanagement.model.Role;
import com.collegemanagement.repository.UserRepository;
import com.collegemanagement.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public Map<String, Long> getDashboardStats() {
        try {
            Map<String, Long> stats = new HashMap<>();
            Long studentCount = userRepository.countByRole(Role.STUDENT);
            Long teacherCount = userRepository.countByRole(Role.TEACHER);
            Long courseCount = courseRepository.count();

            stats.put("totalStudents", studentCount != null ? studentCount : 0L);
            stats.put("totalTeachers", teacherCount != null ? teacherCount : 0L);
            stats.put("totalCourses", courseCount != null ? courseCount : 0L);
            return stats;
        } catch (Exception e) {
            Map<String, Long> defaultStats = new HashMap<>();
            defaultStats.put("totalStudents", 0L);
            defaultStats.put("totalTeachers", 0L);
            defaultStats.put("totalCourses", 0L);
            return defaultStats;
        }
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users != null ? users : new ArrayList<>();
    }

    @Transactional(readOnly = true)
    public List<User> getAllStudents() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        if (students == null) {
            return new ArrayList<>();
        }
        // Initialize enrollments for each student
        students.forEach(student -> {
            if (student.getEnrollments() != null) {
                student.getEnrollments().forEach(enrollment -> {
                    if (enrollment.getCourse() != null) {
                        enrollment.getCourse().getName(); // Force loading of course data
                        if (enrollment.getCourse().getTeacher() != null) {
                            enrollment.getCourse().getTeacher().getName(); // Force loading of teacher data
                        }
                    }
                });
            }
            // Also initialize enrolledCourses
            if (student.getEnrolledCourses() != null) {
                student.getEnrolledCourses().forEach(course -> {
                    course.getName(); // Force loading of course data
                    if (course.getTeacher() != null) {
                        course.getTeacher().getName(); // Force loading of teacher data
                    }
                });
            }
        });
        return students;
    }

    @Transactional(readOnly = true)
    public List<User> getAllTeachers() {
        List<User> teachers = userRepository.findByRole(Role.TEACHER);
        if (teachers == null) {
            return new ArrayList<>();
        }
        // Initialize coursesTaught for each teacher
        teachers.forEach(teacher -> {
            if (teacher.getCoursesTaught() != null) {
                teacher.getCoursesTaught().forEach(course -> {
                    course.getName(); // Force loading of course data
                });
            }
        });
        return teachers;
    }

    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            if (courses == null) {
                return new ArrayList<>();
            }
            // Initialize teacher data for each course
            courses.forEach(course -> {
                if (course.getTeacher() != null) {
                    course.getTeacher().getName(); // Force loading of teacher data
                }
            });
            return courses;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Transactional
    public Course createCourse(Course course) {
        if (course.getName() == null || course.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Course name is required");
        }

        try {
            if (course.getTeacher() != null && course.getTeacher().getId() != null) {
                User teacher = userRepository.findById(course.getTeacher().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
                
                if (teacher.getRole() != Role.TEACHER) {
                    throw new IllegalArgumentException("Assigned user is not a TEACHER");
                }
                course.setTeacher(teacher);
            }

            return courseRepository.save(course);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create course: " + e.getMessage());
        }
    }

    @Transactional
    public Course updateCourse(Long courseId, Course updatedCourse) {
        if (updatedCourse.getName() == null || updatedCourse.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Course name is required");
        }

        try {
            Course existingCourse = courseRepository.findById(courseId)
                    .orElseThrow(() -> new IllegalArgumentException("Course not found"));

            existingCourse.setName(updatedCourse.getName());
            existingCourse.setDescription(updatedCourse.getDescription());

            if (updatedCourse.getTeacher() != null && updatedCourse.getTeacher().getId() != null) {
                User teacher = userRepository.findById(updatedCourse.getTeacher().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
                
                if (teacher.getRole() != Role.TEACHER) {
                    throw new IllegalArgumentException("Assigned user is not a TEACHER");
                }
                existingCourse.setTeacher(teacher);
            } else {
                existingCourse.setTeacher(null);
            }

            return courseRepository.save(existingCourse);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update course: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteCourse(Long id) {
        try {
            Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

            // Check if there are any enrolled students
            if (!course.getEnrollments().isEmpty()) {
                throw new IllegalStateException("Cannot delete course: There are students enrolled in this course. Please unenroll all students first.");
            }

            // Remove course from teacher's courses taught
            if (course.getTeacher() != null) {
                User teacher = course.getTeacher();
                teacher.getCoursesTaught().remove(course);
                userRepository.save(teacher);
            }

            // Clear all assignments
            course.getAssignments().clear();

            // Save the course with cleared relationships
            courseRepository.save(course);

            // Finally delete the course
            courseRepository.deleteById(id);
        } catch (Exception e) {
            if (e instanceof IllegalStateException || e instanceof IllegalArgumentException) {
                throw e;
            }
            throw new RuntimeException("An unexpected error occurred while deleting the course: " + e.getMessage());
        }
    }
} 
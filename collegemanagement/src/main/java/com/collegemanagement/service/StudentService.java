package com.collegemanagement.service;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.AssignmentSubmission;
import com.collegemanagement.model.Course;
import com.collegemanagement.model.User;
import com.collegemanagement.repository.AssignmentRepository;
import com.collegemanagement.repository.AssignmentSubmissionRepository;
import com.collegemanagement.repository.CourseRepository;
import com.collegemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Comparator;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public List<Course> getMyCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return courseRepository.findByEnrollments_Student(student);
    }

    public Course getCourseDetails(Long courseId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check both enrollments and enrolledCourses
        boolean isEnrolled = course.getEnrollments().stream()
                .anyMatch(enrollment -> enrollment.getStudent().getId().equals(student.getId())) ||
                student.getEnrolledCourses().stream()
                .anyMatch(enrolledCourse -> enrolledCourse.getId().equals(courseId));
        
        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }
        
        // Initialize teacher data
        if (course.getTeacher() != null) {
            course.getTeacher().getName();
        }
        
        return course;
    }

    public List<Assignment> getCourseAssignments(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return assignmentRepository.findByCourse(course);
    }

    public Assignment getAssignmentDetails(Long assignmentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        // Check if student is enrolled in the course
        boolean isEnrolled = student.getEnrolledCourses().stream()
                .anyMatch(course -> course.getId().equals(assignment.getCourse().getId()));
        
        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }
        
        return assignment;
    }

    public AssignmentSubmission submitAssignment(Long assignmentId, AssignmentSubmission submission) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        // Check if student is enrolled in the course
        boolean isEnrolled = student.getEnrolledCourses().stream()
                .anyMatch(course -> course.getId().equals(assignment.getCourse().getId()));
        
        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }
        
        // Check if assignment is past due date
        if (assignment.getDueDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Assignment is past due date");
        }
        
        // Check if student has already submitted
        Optional<AssignmentSubmission> existingSubmission = submissionRepository
                .findByAssignmentAndStudent(assignment, student);
        
        if (existingSubmission.isPresent()) {
            throw new RuntimeException("You have already submitted this assignment");
        }
        
        submission.setStudent(student);
        submission.setAssignment(assignment);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setSubmissionDateTime(LocalDateTime.now());
        submission.setStatus("SUBMITTED");
        
        return submissionRepository.save(submission);
    }

    public AssignmentSubmission getMySubmission(Long assignmentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        return submissionRepository.findByAssignmentAndStudent(assignment, student)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    public Map<Long, Double> getMyGrades() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return submissionRepository.findByStudent(student).stream()
                .collect(Collectors.toMap(
                        submission -> submission.getAssignment().getId(),
                        AssignmentSubmission::getGrade
                ));
    }

    @Transactional(readOnly = true)
    public List<Course> getEnrolledCourses(Long studentId) {
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new IllegalArgumentException("Student not found"));
            return student.getEnrolledCourses().stream().toList();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Transactional
    public void enrollInCourse(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        Set<Course> enrolledCourses = student.getEnrolledCourses();
        if (enrolledCourses.contains(course)) {
            throw new IllegalArgumentException("Student is already enrolled in this course");
        }

        enrolledCourses.add(course);
        userRepository.save(student);
    }

    @Transactional
    public void unenrollFromCourse(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        Set<Course> enrolledCourses = student.getEnrolledCourses();
        if (!enrolledCourses.contains(course)) {
            throw new IllegalArgumentException("Student is not enrolled in this course");
        }

        enrolledCourses.remove(course);
        userRepository.save(student);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardData(Long studentId) {
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new IllegalArgumentException("Student not found"));

            Map<String, Object> dashboardData = new HashMap<>();
            
            // Get enrolled courses
            List<Course> enrolledCourses = student.getEnrolledCourses().stream()
                    .map(course -> {
                        // Initialize teacher data
                        if (course.getTeacher() != null) {
                            course.getTeacher().getName();
                        }
                        return course;
                    })
                    .collect(Collectors.toList());
            dashboardData.put("enrolledCourses", enrolledCourses);

            // Get upcoming assignments
            List<Assignment> upcomingAssignments = student.getEnrolledCourses().stream()
                    .flatMap(course -> course.getAssignments().stream())
                    .filter(assignment -> !assignment.isSubmitted())
                    .limit(5)
                    .collect(Collectors.toList());
            dashboardData.put("upcomingAssignments", upcomingAssignments);

            // Get recent grades
            List<AssignmentSubmission> recentGrades = student.getSubmissions().stream()
                    .filter(submission -> submission.getGrade() != null)
                    .limit(5)
                    .collect(Collectors.toList());
            dashboardData.put("recentGrades", recentGrades);

            return dashboardData;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch dashboard data: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getGrades(Long studentId) {
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new IllegalArgumentException("Student not found"));

            return student.getSubmissions().stream()
                    .filter(submission -> submission.getGrade() != null)
                    .map(submission -> {
                        Map<String, Object> gradeInfo = new HashMap<>();
                        gradeInfo.put("id", submission.getId());
                        gradeInfo.put("assignmentTitle", submission.getAssignment().getTitle());
                        gradeInfo.put("courseName", submission.getAssignment().getCourse().getName());
                        gradeInfo.put("grade", submission.getGrade());
                        gradeInfo.put("submissionDate", submission.getSubmissionDateTime());
                        return gradeInfo;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Transactional
    public void enrollInAllCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        // Get all available courses
        List<Course> allCourses = courseRepository.findAll();
        
        // Get courses the student is already enrolled in
        Set<Course> enrolledCourses = student.getEnrolledCourses();
        
        // Enroll in courses that the student is not already enrolled in
        for (Course course : allCourses) {
            if (!enrolledCourses.contains(course)) {
                enrolledCourses.add(course);
            }
        }
        
        userRepository.save(student);
    }

    public List<AssignmentSubmission> getAllMySubmissions(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return submissionRepository.findByStudent(student);
    }
} 
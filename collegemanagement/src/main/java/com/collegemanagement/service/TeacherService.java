package com.collegemanagement.service;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.AssignmentSubmission;
import com.collegemanagement.model.Course;
import com.collegemanagement.model.Enrollment;
import com.collegemanagement.model.User;
import com.collegemanagement.repository.AssignmentRepository;
import com.collegemanagement.repository.AssignmentSubmissionRepository;
import com.collegemanagement.repository.CourseRepository;
import com.collegemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private static final Logger logger = LoggerFactory.getLogger(TeacherService.class);
    
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Map<String, Long> getDashboardStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Map<String, Long> stats = new HashMap<>();
        
        // Get total courses taught by the teacher
        List<Course> courses = courseRepository.findByTeacher(teacher);
        logger.info("Found {} courses for teacher {}", courses.size(), teacher.getEmail());
        stats.put("totalCourses", (long) courses.size());

        // Calculate total students across all courses taught by this teacher
        long totalStudents = courses.stream()
                                .flatMap(course -> course.getEnrollments().stream())
                                .map(Enrollment::getStudent)
                                .distinct()
                                .count();
        stats.put("totalStudents", totalStudents);

        // Calculate total assignments across all courses taught by this teacher
        long totalAssignments = courses.stream()
                                  .flatMap(course -> course.getAssignments().stream())
                                  .count();
        stats.put("totalAssignments", totalAssignments);

        // Get pending submissions (submissions that need grading)
        long pendingSubmissions = courses.stream()
                .flatMap(course -> course.getAssignments().stream())
                .flatMap(assignment -> assignment.getSubmissions().stream())
                .filter(submission -> submission.getGrade() == null)
                .count();
        stats.put("pendingSubmissions", pendingSubmissions);

        return stats;
    }

    @Transactional(readOnly = true)
    public List<Course> getMyCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        List<Course> courses = courseRepository.findByTeacher(teacher);
        
        // Initialize assignments for each course
        courses.forEach(course -> {
            if (course.getAssignments() != null) {
                course.getAssignments().forEach(assignment -> {
                    assignment.getTitle(); // Force loading of assignment data
                    if (assignment.getSubmissions() != null) {
                        assignment.getSubmissions().size(); // Force loading of submissions
                    }
                });
            }
        });
        
        return courses;
    }

    @Transactional(readOnly = true)
    public List<User> getStudentsInCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return course.getEnrollments().stream()
                .map(enrollment -> enrollment.getStudent())
                .toList();
    }

    @Transactional
    public Assignment createAssignment(Long courseId, Assignment assignment) {
        logger.info("Creating assignment for course: {}", courseId);
        
        // Get the current teacher
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Get the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Verify that the teacher is assigned to this course
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            logger.error("Teacher {} is not authorized to create assignments for course {}", teacher.getId(), courseId);
            throw new RuntimeException("You are not authorized to create assignments for this course");
        }

        // Validate assignment data
        if (assignment.getTitle() == null || assignment.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (assignment.getDescription() == null || assignment.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }
        if (assignment.getDueDate() == null) {
            throw new RuntimeException("Due date is required");
        }
        if (assignment.getDueDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Due date must be in the future");
        }

        // Set the course for the assignment
        assignment.setCourse(course);
        
        // Save the assignment
        Assignment savedAssignment = assignmentRepository.save(assignment);
        logger.info("Assignment created successfully with ID: {}", savedAssignment.getId());
        
        return savedAssignment;
    }

    @Transactional(readOnly = true)
    public List<Assignment> getCourseAssignments(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return course.getAssignments();
    }

    @Transactional(readOnly = true)
    public List<AssignmentSubmission> getAssignmentSubmissions(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return submissionRepository.findByAssignment(assignment);
    }

    @Transactional
    public void gradeSubmission(Long submissionId, Double grade, String feedback) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        if (grade < 0 || grade > 100) {
            throw new RuntimeException("Grade must be between 0 and 100");
        }
        
        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submission.setStatus("GRADED");
        submissionRepository.save(submission);
    }

    @Transactional
    public Assignment updateAssignment(Long assignmentId, Assignment updatedAssignment) {
        // Get the current teacher
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Get the existing assignment
        Assignment existingAssignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Verify that the teacher is assigned to this course
        if (!existingAssignment.getCourse().getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not authorized to update this assignment");
        }

        // Validate assignment fields
        if (updatedAssignment.getTitle() == null || updatedAssignment.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (updatedAssignment.getDescription() == null || updatedAssignment.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }
        if (updatedAssignment.getDueDate() == null) {
            throw new RuntimeException("Due date is required");
        }

        // Update the assignment fields
        existingAssignment.setTitle(updatedAssignment.getTitle());
        existingAssignment.setDescription(updatedAssignment.getDescription());
        existingAssignment.setDueDate(updatedAssignment.getDueDate());

        return assignmentRepository.save(existingAssignment);
    }

    @Transactional
    public void deleteAssignment(Long assignmentId) {
        logger.info("Starting deletion of assignment: {}", assignmentId);
        
        // Get the current teacher
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        logger.debug("Found teacher: {}", teacher.getEmail());

        // Get the assignment with its submissions
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        logger.debug("Found assignment: {}", assignment.getTitle());

        // Verify that the teacher is assigned to this course
        if (!assignment.getCourse().getTeacher().getId().equals(teacher.getId())) {
            logger.error("Teacher {} is not authorized to delete assignment {}", teacher.getId(), assignmentId);
            throw new RuntimeException("You are not authorized to delete this assignment");
        }

        // Delete associated files first
        assignment.getSubmissions().forEach(submission -> {
            if (submission.getFileUrl() != null && !submission.getFileUrl().isEmpty()) {
                try {
                    fileStorageService.deleteFile(submission.getFileUrl());
                    logger.debug("Deleted file for submission {}: {}", submission.getId(), submission.getFileUrl());
                } catch (Exception e) {
                    logger.warn("Could not delete file for submission {}: {}", submission.getId(), e.getMessage());
                }
            }
        });

        // Delete all submissions associated with the assignment
        submissionRepository.deleteAll(assignment.getSubmissions());
        logger.debug("Deleted all submissions for assignment {}", assignmentId);

        // Finally, delete the assignment
        assignmentRepository.delete(assignment);
        logger.info("Assignment {} deleted successfully", assignmentId);
    }

    @Transactional(readOnly = true)
    public AssignmentSubmission getSubmissionById(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    @Transactional(readOnly = true)
    public User getStudentDetails(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Verify that the student is enrolled in at least one of the teacher's courses
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        boolean isEnrolledInTeacherCourse = student.getEnrollments().stream()
                .anyMatch(enrollment -> enrollment.getCourse().getTeacher().getId().equals(teacher.getId()));
        
        if (!isEnrolledInTeacherCourse) {
            throw new RuntimeException("Student is not enrolled in any of your courses");
        }
        
        return student;
    }

    @Transactional(readOnly = true)
    public List<AssignmentSubmission> getStudentSubmissions(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Verify that the student is enrolled in at least one of the teacher's courses
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        return student.getSubmissions().stream()
                .filter(submission -> submission.getAssignment().getCourse().getTeacher().getId().equals(teacher.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<User> getAllStudents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        logger.info("Fetching students for teacher: {}", teacher.getEmail());

        // Get all courses taught by the teacher
        List<Course> courses = courseRepository.findByTeacher(teacher);
        logger.info("Found {} courses for teacher", courses.size());
        
        // Get all enrollments from these courses
        List<Enrollment> allEnrollments = courses.stream()
                .flatMap(course -> course.getEnrollments().stream())
                .collect(Collectors.toList());
        
        logger.info("Found {} total enrollments", allEnrollments.size());

        // Get unique students from enrollments
        List<User> students = allEnrollments.stream()
                .map(Enrollment::getStudent)
                .distinct()
                .collect(Collectors.toList());
        
        logger.info("Found {} unique students", students.size());

        // Initialize enrollments for each student
        students.forEach(student -> {
            // Get enrollments for this student in the teacher's courses
            List<Enrollment> studentEnrollments = allEnrollments.stream()
                    .filter(enrollment -> enrollment.getStudent().getId().equals(student.getId()))
                    .collect(Collectors.toList());
            
            // Set the filtered enrollments
            student.setEnrollments(studentEnrollments);
            
            logger.info("Student {} is enrolled in {} courses", 
                student.getEmail(), studentEnrollments.size());
        });
        
        return students;
    }
} 
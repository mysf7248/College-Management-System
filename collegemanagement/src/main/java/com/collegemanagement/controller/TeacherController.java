package com.collegemanagement.controller;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.AssignmentSubmission;
import com.collegemanagement.model.Course;
import com.collegemanagement.model.User;
import com.collegemanagement.service.TeacherService;
import com.collegemanagement.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {
    private static final Logger logger = LoggerFactory.getLogger(TeacherController.class);
    private final TeacherService teacherService;
    private final FileStorageService fileStorageService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        try {
            return ResponseEntity.ok(teacherService.getDashboardStats());
        } catch (Exception e) {
            logger.error("Error getting dashboard stats", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getMyCourses() {
        try {
        return ResponseEntity.ok(teacherService.getMyCourses());
        } catch (Exception e) {
            logger.error("Error getting teacher courses", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<User>> getStudentsInCourse(@PathVariable Long courseId) {
        try {
        return ResponseEntity.ok(teacherService.getStudentsInCourse(courseId));
        } catch (Exception e) {
            logger.error("Error getting students in course: " + courseId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/courses/{courseId}/assignments")
    public ResponseEntity<?> createAssignment(
            @PathVariable Long courseId,
            @RequestBody Assignment assignment) {
        try {
            logger.info("Creating assignment for course: {}", courseId);
            logger.debug("Assignment data: {}", assignment);
            
            if (assignment.getTitle() == null || assignment.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (assignment.getDescription() == null || assignment.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required");
            }
            if (assignment.getDueDate() == null) {
                return ResponseEntity.badRequest().body("Due date is required");
            }

            Assignment createdAssignment = teacherService.createAssignment(courseId, assignment);
            logger.info("Assignment created successfully with ID: {}", createdAssignment.getId());
            return ResponseEntity.ok(createdAssignment);
        } catch (RuntimeException e) {
            logger.error("Error creating assignment for course: " + courseId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error creating assignment for course: " + courseId, e);
            return ResponseEntity.internalServerError().body("An error occurred while creating the assignment");
        }
    }

    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<Assignment>> getCourseAssignments(@PathVariable Long courseId) {
        try {
        return ResponseEntity.ok(teacherService.getCourseAssignments(courseId));
        } catch (Exception e) {
            logger.error("Error getting assignments for course: " + courseId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmission>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        try {
        return ResponseEntity.ok(teacherService.getAssignmentSubmissions(assignmentId));
        } catch (Exception e) {
            logger.error("Error getting submissions for assignment: " + assignmentId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<?> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam Double grade,
            @RequestParam(required = false) String feedback
    ) {
        try {
            teacherService.gradeSubmission(submissionId, grade, feedback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error grading submission: " + submissionId, e);
            return ResponseEntity.internalServerError().body("An error occurred while grading the submission");
        }
    }

    @PutMapping("/assignments/{assignmentId}")
    public ResponseEntity<?> updateAssignment(
            @PathVariable Long assignmentId,
            @RequestBody Assignment assignment
    ) {
        try {
            logger.info("Updating assignment: {}", assignmentId);
            Assignment updatedAssignment = teacherService.updateAssignment(assignmentId, assignment);
            return ResponseEntity.ok(updatedAssignment);
        } catch (RuntimeException e) {
            logger.error("Error updating assignment: " + assignmentId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error updating assignment: " + assignmentId, e);
            return ResponseEntity.internalServerError().body("An error occurred while updating the assignment");
        }
    }

    @DeleteMapping("/assignments/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long assignmentId) {
        try {
            logger.info("Deleting assignment: {}", assignmentId);
            teacherService.deleteAssignment(assignmentId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting assignment: " + assignmentId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error deleting assignment: " + assignmentId, e);
            return ResponseEntity.internalServerError().body("An error occurred while deleting the assignment");
        }
    }

    @GetMapping("/submissions/{submissionId}/file")
    public ResponseEntity<?> downloadSubmissionFile(@PathVariable Long submissionId) {
        try {
            AssignmentSubmission submission = teacherService.getSubmissionById(submissionId);
            
            if (submission.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] fileContent = fileStorageService.loadFile(submission.getFileUrl());
            String filename = submission.getFileUrl();
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            logger.error("Error downloading submission file: " + submissionId, e);
            return ResponseEntity.internalServerError().body("An error occurred while downloading the file");
        }
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudentDetails(@PathVariable Long studentId) {
        try {
            User student = teacherService.getStudentDetails(studentId);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            logger.error("Error getting student details: " + studentId, e);
            return ResponseEntity.internalServerError().body("An error occurred while fetching student details");
        }
    }

    @GetMapping("/students/{studentId}/submissions")
    public ResponseEntity<?> getStudentSubmissions(@PathVariable Long studentId) {
        try {
            List<AssignmentSubmission> submissions = teacherService.getStudentSubmissions(studentId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            logger.error("Error getting student submissions: " + studentId, e);
            return ResponseEntity.internalServerError().body("An error occurred while fetching student submissions");
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<User> students = teacherService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            logger.error("Error getting all students", e);
            return ResponseEntity.internalServerError().body("An error occurred while fetching students");
        }
    }
}
package com.collegemanagement.controller;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.AssignmentSubmission;
import com.collegemanagement.model.Course;
import com.collegemanagement.model.User;
import com.collegemanagement.service.StudentService;
import com.collegemanagement.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me/courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyCourses(Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            List<Course> courses = studentService.getEnrolledCourses(student.getId());
            return ResponseEntity.ok(courses != null ? courses : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/me/grades")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyGrades(Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            List<Map<String, Object>> grades = studentService.getGrades(student.getId());
            return ResponseEntity.ok(grades != null ? grades : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/me/courses/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyCourseDetails(@PathVariable Long courseId, Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            Course course = studentService.getCourseDetails(courseId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("You are not enrolled in this course")) {
                return ResponseEntity.status(403).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("An error occurred while fetching course details");
        }
    }

    @GetMapping("/me/courses/{courseId}/assignments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyCourseAssignments(@PathVariable Long courseId, Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            List<Assignment> assignments = studentService.getCourseAssignments(courseId);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/me/assignments/{assignmentId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitMyAssignment(
            @PathVariable Long assignmentId,
            @RequestParam(required = false) String submissionText,
            @RequestParam(required = false) MultipartFile file,
            Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            AssignmentSubmission submission = new AssignmentSubmission();
            submission.setSubmissionText(submissionText);
            
            if (file != null && !file.isEmpty()) {
                String filename = fileStorageService.storeFile(file);
                submission.setFileUrl(filename);
            }
            
            AssignmentSubmission result = studentService.submitAssignment(assignmentId, submission);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me/assignments/{assignmentId}/submission")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMySubmission(@PathVariable Long assignmentId, Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            AssignmentSubmission submission = studentService.getMySubmission(assignmentId);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me/assignments/{assignmentId}/submission/file")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> downloadSubmissionFile(
            @PathVariable Long assignmentId,
            Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            AssignmentSubmission submission = studentService.getMySubmission(assignmentId);
            
            if (submission.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] fileContent = fileStorageService.loadFile(submission.getFileUrl());
            String filename = submission.getFileUrl();
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{studentId}/courses")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")
    public ResponseEntity<?> getEnrolledCourses(@PathVariable Long studentId) {
        try {
            List<Course> courses = studentService.getEnrolledCourses(studentId);
            return ResponseEntity.ok(courses != null ? courses : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/{studentId}/enroll/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT') and (#studentId == authentication.principal.id or hasRole('ADMIN'))")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            studentService.enrollInCourse(studentId, courseId);
            return ResponseEntity.ok().body("Successfully enrolled in course");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to enroll in course");
        }
    }

    @DeleteMapping("/{studentId}/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            studentService.unenrollFromCourse(studentId, courseId);
            return ResponseEntity.ok().body("Successfully unenrolled from course");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to unenroll from course");
        }
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<Course> getCourseDetails(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.getCourseDetails(courseId));
    }

    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<Assignment>> getCourseAssignments(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.getCourseAssignments(courseId));
    }

    @PostMapping("/assignments/{assignmentId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam(required = false) String submissionText,
            @RequestParam(required = false) MultipartFile file
    ) {
        try {
            AssignmentSubmission submission = new AssignmentSubmission();
            submission.setSubmissionText(submissionText);
            
            if (file != null && !file.isEmpty()) {
                String filename = fileStorageService.storeFile(file);
                submission.setFileUrl(filename);
            }
            
            AssignmentSubmission result = studentService.submitAssignment(assignmentId, submission);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getAssignmentDetails(@PathVariable Long assignmentId) {
        logger.info("[StudentController] getAssignmentDetails called with assignmentId: {}", assignmentId);
        try {
            Assignment assignment = studentService.getAssignmentDetails(assignmentId);
            return ResponseEntity.ok(assignment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/{assignmentId}/submission")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMySubmission(@PathVariable Long assignmentId) {
        try {
            AssignmentSubmission submission = studentService.getMySubmission(assignmentId);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/{assignmentId}/submission/file")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> downloadSubmissionFile(@PathVariable Long assignmentId) {
        try {
            AssignmentSubmission submission = studentService.getMySubmission(assignmentId);
            
            if (submission.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] fileContent = fileStorageService.loadFile(submission.getFileUrl());
            String filename = submission.getFileUrl();
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{studentId}/grades")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")
    public ResponseEntity<?> getGrades(@PathVariable Long studentId) {
        try {
            List<Map<String, Object>> grades = studentService.getGrades(studentId);
            return ResponseEntity.ok(grades != null ? grades : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/{studentId}/dashboard")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")
    public ResponseEntity<?> getDashboardData(@PathVariable Long studentId) {
        try {
            Map<String, Object> dashboardData = studentService.getDashboardData(studentId);
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> defaultData = new HashMap<>();
            defaultData.put("enrolledCourses", List.of());
            defaultData.put("upcomingAssignments", List.of());
            defaultData.put("recentGrades", List.of());
            return ResponseEntity.ok(defaultData);
        }
    }

    @PostMapping("/{studentId}/enroll-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT') and (#studentId == authentication.principal.id or hasRole('ADMIN'))")
    public ResponseEntity<?> enrollInAllCourses(@PathVariable Long studentId) {
        try {
            studentService.enrollInAllCourses(studentId);
            return ResponseEntity.ok().body("Successfully enrolled in all courses");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to enroll in courses");
        }
    }

    @GetMapping("/me/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMySubmissions(Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            List<AssignmentSubmission> submissions = studentService.getAllMySubmissions(student.getId());
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
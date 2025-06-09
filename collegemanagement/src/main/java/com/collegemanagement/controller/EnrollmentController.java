package com.collegemanagement.controller;

import com.collegemanagement.model.Enrollment;
import com.collegemanagement.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getStudentEnrollments(@PathVariable Long studentId) {
        try {
            List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(studentId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Enrollment> enrollStudent(@RequestBody Enrollment enrollment) {
        try {
            Enrollment savedEnrollment = enrollmentService.enrollStudent(enrollment);
            return ResponseEntity.ok(savedEnrollment);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeEnrollment(@PathVariable Long id) {
        try {
            enrollmentService.removeEnrollment(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 
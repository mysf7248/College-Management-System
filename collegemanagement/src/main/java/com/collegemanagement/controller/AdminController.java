package com.collegemanagement.controller;

import com.collegemanagement.model.User;
import com.collegemanagement.model.Course;
import com.collegemanagement.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Long> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Long> defaultStats = Map.of(
                "totalStudents", 0L,
                "totalTeachers", 0L,
                "totalCourses", 0L
            );
            return ResponseEntity.ok(defaultStats);
        }
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getAllTeachers() {
        try {
            List<User> teachers = adminService.getAllTeachers();
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        try {
            List<User> students = adminService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        if (users == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = adminService.getAllCourses();
        if (courses == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(courses);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        try {
            Course savedCourse = adminService.createCourse(course);
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            Course updatedCourse = adminService.updateCourse(id, course);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        adminService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
} 
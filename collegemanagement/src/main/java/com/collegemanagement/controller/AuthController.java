package com.collegemanagement.controller;

import com.collegemanagement.dto.AuthenticationRequest;
import com.collegemanagement.dto.AuthenticationResponse;
import com.collegemanagement.dto.RegisterRequest;
import com.collegemanagement.model.Role;
import com.collegemanagement.model.User;
import com.collegemanagement.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        logger.info("Received registration request for user: {}", request.getEmail());
        try {
            AuthenticationResponse response = authService.register(request);
            logger.info("Registration successful for user: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Registration failed due to invalid input: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (RuntimeException e) {
            logger.error("Registration failed due to runtime error: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            if (e.getMessage().contains("Email already exists")) {
                errorResponse.put("message", "This email is already registered. Please use a different email or try logging in.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            logger.error("Registration failed for user {} due to: {}", request.getEmail(), e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "An unexpected error occurred during registration. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        logger.info("Received login request for user: {}", request.getEmail());
        try {
            AuthenticationResponse response = authService.authenticate(request);
            logger.info("Login successful for user: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Login failed due to invalid input: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Login failed for user {} due to: {}", request.getEmail(), e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid credentials or internal server error.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}
package com.collegemanagement.service;

import com.collegemanagement.dto.AuthenticationRequest;
import com.collegemanagement.dto.AuthenticationResponse;
import com.collegemanagement.dto.RegisterRequest;
import com.collegemanagement.model.User;
import com.collegemanagement.repository.UserRepository;
import com.collegemanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        logger.info("Processing registration for user: {}", request.getEmail());
        
        // Validate request
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getRole() == null) {
            throw new IllegalArgumentException("Role is required");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        
        logger.info("Creating new user: {}", user.getEmail());
        userRepository.save(user);
        
        // Generate token
        var jwtToken = jwtService.generateToken(user);
        logger.info("Generated JWT token for user: {}", user.getEmail());
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("Processing authentication for user: {}", request.getEmail());
        
        // Validate request
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // Get user details
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate token
        var jwtToken = jwtService.generateToken(user);
        logger.info("Generated JWT token for user: {}", user.getEmail());
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
} 
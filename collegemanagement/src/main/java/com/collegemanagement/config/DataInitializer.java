package com.collegemanagement.config;

import com.collegemanagement.model.Role;
import com.collegemanagement.model.User;
import com.collegemanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@college.com")) {
                String rawPassword = "admin123";
                String encodedPassword = passwordEncoder.encode(rawPassword);
                logger.info("Creating admin user with encoded password: {}", encodedPassword);
                
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@college.com")
                        .password(encodedPassword)
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
                logger.info("Admin user created successfully");
            } else {
                logger.info("Admin user already exists");
            }
        } catch (Exception e) {
            logger.error("Error initializing admin user: {}", e.getMessage(), e);
        }
    }
} 
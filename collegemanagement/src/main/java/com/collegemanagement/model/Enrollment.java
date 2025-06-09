package com.collegemanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "enrollments")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"enrollments", "coursesTaught", "submissions"})
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties({"enrollments", "assignments", "teacher"})
    private Course course;

    @Column(nullable = false)
    private LocalDateTime enrolledAt = LocalDateTime.now();

    private String status; // e.g., "ENROLLED", "COMPLETED", "DROPPED"
} 
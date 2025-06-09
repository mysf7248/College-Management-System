package com.collegemanagement.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "assignment_submissions")
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private String submissionText;
    private String fileUrl;
    private LocalDateTime submittedAt;
    private Double grade; // Nullable, only set when graded
    private String feedback;
    private LocalDateTime submissionDateTime;
    private String status; // SUBMITTED, PENDING, GRADED

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.submittedAt = now;
        this.submissionDateTime = now;
    }
}
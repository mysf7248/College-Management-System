package com.collegemanagement.repository;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.AssignmentSubmission;
import com.collegemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignment(Assignment assignment);
    List<AssignmentSubmission> findByStudent(User student);
    Optional<AssignmentSubmission> findByAssignmentAndStudent(Assignment assignment, User student);
}
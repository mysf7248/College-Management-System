package com.collegemanagement.repository;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.Grade;
import com.collegemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudent(User student);
    List<Grade> findByAssignment(Assignment assignment);
    Optional<Grade> findByStudentAndAssignment(User student, Assignment assignment);
} 
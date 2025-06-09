package com.collegemanagement.repository;

import com.collegemanagement.model.Enrollment;
import com.collegemanagement.model.User;
import com.collegemanagement.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    boolean existsByStudentAndCourse(User student, Course course);
} 
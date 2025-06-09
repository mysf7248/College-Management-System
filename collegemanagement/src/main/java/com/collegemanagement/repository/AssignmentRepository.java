package com.collegemanagement.repository;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourse(Course course);
    List<Assignment> findByCourseId(Long courseId);
}
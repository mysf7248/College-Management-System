package com.collegemanagement.repository;

import com.collegemanagement.model.Course;
import com.collegemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacher(User teacher);
    List<Course> findByEnrollments_Student(User student);
}
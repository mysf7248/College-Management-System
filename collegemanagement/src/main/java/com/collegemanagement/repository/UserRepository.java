package com.collegemanagement.repository;

import com.collegemanagement.model.User;
import com.collegemanagement.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findByRole(Role role);
    long countByRole(Role role);

    // Example: Find students enrolled in a course (assuming a many-to-many relation exists; adjust as needed)
    @Query("SELECT u FROM User u JOIN Enrollment e ON u.id = e.student.id WHERE e.course.id = :courseId")
    List<User> findStudentsByCourseId(Long courseId);

    // Example: Find teachers by course (assuming a course has a teacher)
    @Query("SELECT c.teacher FROM Course c WHERE c.id = :courseId")
    User findTeacherByCourseId(Long courseId);
}
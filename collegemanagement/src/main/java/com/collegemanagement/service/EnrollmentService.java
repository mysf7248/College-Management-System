package com.collegemanagement.service;

import com.collegemanagement.model.Enrollment;
import com.collegemanagement.model.User;
import com.collegemanagement.model.Course;
import com.collegemanagement.repository.EnrollmentRepository;
import com.collegemanagement.repository.UserRepository;
import com.collegemanagement.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public List<Enrollment> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Transactional
    public Enrollment enrollStudent(Enrollment enrollment) {
        User student = userRepository.findById(enrollment.getStudent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        Course course = courseRepository.findById(enrollment.getCourse().getId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Check if student is already enrolled in the course
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new IllegalArgumentException("Student is already enrolled in this course");
        }

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public void removeEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }
} 
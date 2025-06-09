package com.collegemanagement.service;

import com.collegemanagement.model.Assignment;
import com.collegemanagement.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {
    @Autowired
    private AssignmentRepository assignmentRepository;

    public List<Assignment> getAssignmentsByCourseId(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public Optional<Assignment> getAssignment(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment saveAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}
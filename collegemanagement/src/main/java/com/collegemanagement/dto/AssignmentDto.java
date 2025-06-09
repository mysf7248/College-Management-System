package com.collegemanagement.dto;

import lombok.Data;

@Data
public class AssignmentDto {
    private Long id;
    private String title;
    private String description;
    private Long courseId;
    private String dueDate;
}
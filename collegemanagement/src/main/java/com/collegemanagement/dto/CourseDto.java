package com.collegemanagement.dto;

import lombok.Data;

@Data
public class CourseDto {
    private Long id;
    private String name;
    private String description;
    private Long teacherId;
    private String teacherName;
    private String teacherEmail;
}
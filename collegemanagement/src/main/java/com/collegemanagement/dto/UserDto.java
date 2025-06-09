package com.collegemanagement.dto;

import com.collegemanagement.model.User;
import com.collegemanagement.model.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
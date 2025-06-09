package com.collegemanagement.dto;

import com.collegemanagement.model.User;
import com.collegemanagement.model.Role;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
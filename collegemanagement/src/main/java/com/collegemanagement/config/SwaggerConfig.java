package com.collegemanagement.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI collegemanagementOpenAPI() {
        return new OpenAPI().info(
                new Info().title("College Management API")
                        .description("API documentation for College Management System")
                        .version("v1.0.0"));
    }
}
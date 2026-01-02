
package com.devbuild.inscriptionservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private String status;

    // Let Jackson use the default ISO-8601 format for LocalDateTime,
    // which matches what user-service is returning (e.g. 2025-01-02T00:06:30.249927518)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String specialty;
    private String laboratory;
    private String studentId;
}

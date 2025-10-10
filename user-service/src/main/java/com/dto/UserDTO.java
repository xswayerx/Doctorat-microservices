package com.dto;

import java.time.LocalDateTime;

import com.enums.UserRole;
import com.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private String studentId;    // for CANDIDAT/DOCTORANT
    private String specialty;    // for DIRECTEUR_THESE
    private String laboratory;   // for DIRECTEUR_THESE
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

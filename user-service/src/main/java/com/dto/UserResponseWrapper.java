package com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseWrapper {
    private boolean success;
    private String message;
    private UserDTO data;

    public static UserResponseWrapper success(UserDTO data, String message) {
        return UserResponseWrapper.builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }
}

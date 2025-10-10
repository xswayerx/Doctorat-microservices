package com.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponse {
    private boolean success;
    private String message;
    private List<UserDTO> data;

    public static UserListResponse success(List<UserDTO> data, String message) {
        return UserListResponse.builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }
}

package com.example.systemegzaminacyjny.dto;

import lombok.Getter;

@Getter
public class LoginResponse {
    private final Long id;
    private final String username;
    private final String role;
    private final String token;

    public LoginResponse(Long id, String username, String role, String token) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.token = token;
    }
}

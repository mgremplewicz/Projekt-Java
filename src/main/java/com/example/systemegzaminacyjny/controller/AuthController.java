package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.service.AuthService;
import com.example.systemegzaminacyjny.dto.LoginRequest;
import com.example.systemegzaminacyjny.dto.LoginResponse;
import com.example.systemegzaminacyjny.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})

public class AuthController
{
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                "local-token-" + user.getId()
        );
        return ResponseEntity.ok(response);
    }
}

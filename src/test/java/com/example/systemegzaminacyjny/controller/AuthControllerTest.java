package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.dto.LoginRequest;
import com.example.systemegzaminacyjny.dto.LoginResponse;
import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void loginOk() {
        LoginRequest request = new LoginRequest();
        request.setUsername("student");
        request.setPassword("student");
        User user = new User();
        user.setId(7L);
        user.setUsername("student");
        user.setRole("UCZEN");

        when(authService.authenticate("student", "student")).thenReturn(user);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(7L, response.getBody().getId());
        assertEquals("student", response.getBody().getUsername());
        assertEquals("UCZEN", response.getBody().getRole());
        assertEquals("local-token-7", response.getBody().getToken());
    }

    @Test
    void loginFail() {
        LoginRequest request = new LoginRequest();
        request.setUsername("student");
        request.setPassword("zlehaslo");

        when(authService.authenticate("student", "zlehaslo")).thenReturn(null);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatusCode.valueOf(401), response.getStatusCode());
        assertNull(response.getBody());
    }
}

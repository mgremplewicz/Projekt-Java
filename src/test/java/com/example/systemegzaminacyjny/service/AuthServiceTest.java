package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final AuthService authService = new AuthService(userRepository);

    @Test
    void loginOk()
    {
        User user = new User();
        user.setUsername("student");
        user.setPassword("secret");

        when(userRepository.findByUsername("student")).thenReturn(user);

        User result = authService.authenticate("student", "secret");

        assertSame(user, result);
    }

    @Test
    void wrongPassword() {
        User user = new User();
        user.setUsername("student");
        user.setPassword("secret");

        when(userRepository.findByUsername("student")).thenReturn(user);

        User result = authService.authenticate("student", "wrong");

        assertNull(result);
    }
}

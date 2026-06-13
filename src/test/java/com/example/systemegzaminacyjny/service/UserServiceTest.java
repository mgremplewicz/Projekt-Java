package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final UserService userService = new UserService(userRepository);

    @Test
    void saveUser() {
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.saveUser(user);

        assertSame(user, result);
    }

    @Test
    void getUser() {
        User user = new User();
        when(userRepository.getReferenceById(1L)).thenReturn(user);

        User result = userService.getUserById(1L);

        assertSame(user, result);
    }
}

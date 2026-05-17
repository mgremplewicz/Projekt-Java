package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.User;
import org.springframework.stereotype.Service;
import com.example.systemegzaminacyjny.repository.UserRepository;

@Service
public class AuthService
{
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}

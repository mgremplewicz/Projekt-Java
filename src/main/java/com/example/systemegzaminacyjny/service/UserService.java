package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService
{
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user)
    {
        return userRepository.save(user);
    }

    public User getUserById(Long id)
    {
        return userRepository.getReferenceById(id);
    }
}

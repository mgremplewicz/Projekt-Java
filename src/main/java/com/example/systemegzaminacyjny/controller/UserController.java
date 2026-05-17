package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})

public class UserController
{
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id)
    {
        return userRepository.findById(id).orElseThrow();
    }
}

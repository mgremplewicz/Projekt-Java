package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})

public class QuestionController
{
    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @PostMapping
    public Question addQuestion(@RequestBody Question question)
    {
        return questionRepository.save(question);
    }
}

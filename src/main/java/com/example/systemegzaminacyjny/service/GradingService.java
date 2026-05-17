package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class GradingService
{
    @Autowired
    private QuestionRepository questionRepository;

    public int calculateScore(Map<Long, String> studentAnswers)
    {
        int totalScore = 0;
        if (studentAnswers == null) {
            return totalScore;
        }

        for (Map.Entry<Long, String> entry : studentAnswers.entrySet()) {
            Question q = questionRepository.findById(entry.getKey()).orElseThrow();
            if (entry.getValue() != null && q.getCorrect().equalsIgnoreCase(entry.getValue())) {
                totalScore += q.getPoints();
            }
        }
        return totalScore;
    }

    public int calculateMaxScore(Exam exam) {
        return exam.getQuestionsList().stream()
                .mapToInt(Question::getPoints)
                .sum();
    }
}

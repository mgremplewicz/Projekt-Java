package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GradingServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private GradingService gradingService;

    @Test
    void countScore()
    {
        Question firstQuestion = question(1L, "A", 2);
        Question secondQuestion = question(2L, "B", 3);
        Question thirdQuestion = question(3L, "C", 5);

        when(questionRepository.findById(1L)).thenReturn(Optional.of(firstQuestion));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(secondQuestion));
        when(questionRepository.findById(3L)).thenReturn(Optional.of(thirdQuestion));

        int score = gradingService.calculateScore(Map.of(
                1L, "a",
                2L, "wrong",
                3L, "C"
        ));

        assertEquals(7, score);
    }

    @Test
    void countMaxScore() {
        Exam exam = new Exam();
        exam.setQuestionsList(List.of(
                question(1L, "A", 2),
                question(2L, "B", 3),
                question(3L, "C", 5)
        ));

        int maxScore = gradingService.calculateMaxScore(exam);

        assertEquals(10, maxScore);
    }

    private Question question(Long id, String correct, int points) {
        Question question = new Question();
        question.setId(id);
        question.setContent("Question " + id);
        question.setCorrect(correct);
        question.setPoints(points);
        question.setOptions(List.of("A", "B", "C"));
        return question;
    }
}

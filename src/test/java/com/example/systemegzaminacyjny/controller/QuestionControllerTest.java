package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionControllerTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionController questionController;

    @Test
    void getQuestions() {
        List<Question> questions = List.of(new Question(), new Question());
        when(questionRepository.findAll()).thenReturn(questions);

        List<Question> result = questionController.getAllQuestions();

        assertSame(questions, result);
    }

    @Test
    void addQuestion() {
        Question question = new Question();
        question.setContent("2 + 2 = ?");
        when(questionRepository.save(question)).thenReturn(question);

        Question result = questionController.addQuestion(question);

        assertSame(question, result);
        assertEquals("2 + 2 = ?", result.getContent());
    }
}

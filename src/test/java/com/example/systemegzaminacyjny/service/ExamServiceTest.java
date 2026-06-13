package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.dto.CreateExamRequest;
import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.repository.ExamRepository;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private ExamService examService;

    @Test
    void savesExam() {
        Exam exam = new Exam();
        when(examRepository.save(exam)).thenReturn(exam);

        Exam result = examService.createExam(exam);

        assertSame(exam, result);
    }

    @Test
    void createExamFromRequest() {
        Question firstQuestion = question(1L);
        Question secondQuestion = question(2L);
        CreateExamRequest request = new CreateExamRequest();
        request.setTitle("Java");
        request.setDurationMinutes(45);
        request.setQuestionIds(List.of(1L, 2L));

        when(questionRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(firstQuestion, secondQuestion));
        when(examRepository.save(any(Exam.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Exam result = examService.createExam(request);

        assertEquals("Java", result.getTitle());
        assertEquals(45, result.getDurationMinutes());
        assertIterableEquals(List.of(firstQuestion, secondQuestion), result.getQuestionsList());
    }

    @Test
    void getExam() {
        Question firstQuestion = question(1L);
        Question secondQuestion = question(2L);
        Exam exam = new Exam();
        exam.setId(10L);
        exam.setQuestionsList(new java.util.ArrayList<>(List.of(firstQuestion, secondQuestion)));

        when(examRepository.findById(10L)).thenReturn(Optional.of(exam));

        Exam result = examService.getExamById(10L);

        assertSame(exam, result);
        assertEquals(2, result.getQuestionsList().size());
        assertTrue(result.getQuestionsList().contains(firstQuestion));
        assertTrue(result.getQuestionsList().contains(secondQuestion));
    }

    private Question question(Long id) {
        Question question = new Question();
        question.setId(id);
        question.setContent("Question " + id);
        question.setCorrect("A");
        question.setPoints(1);
        question.setOptions(List.of("A", "B"));
        return question;
    }
}

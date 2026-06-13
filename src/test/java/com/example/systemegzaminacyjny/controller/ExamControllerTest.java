package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.dto.CreateExamRequest;
import com.example.systemegzaminacyjny.dto.ExamSubmission;
import com.example.systemegzaminacyjny.dto.ExamView;
import com.example.systemegzaminacyjny.dto.ResultResponse;
import com.example.systemegzaminacyjny.dto.SubmissionResult;
import com.example.systemegzaminacyjny.model.Attempt;
import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.AttemptRepository;
import com.example.systemegzaminacyjny.repository.ExamRepository;
import com.example.systemegzaminacyjny.repository.UserRepository;
import com.example.systemegzaminacyjny.service.ExamService;
import com.example.systemegzaminacyjny.service.GradingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamControllerTest {

    @Mock
    private ExamService examService;

    @Mock
    private GradingService gradingService;

    @Mock
    private ExamRepository examRepository;

    @Mock
    private AttemptRepository attemptRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExamController examController;

    @Test
    void getExams() {
        Exam exam = exam(1L, "Matematyka");
        when(examService.getAllExams()).thenReturn(List.of(exam));

        List<ExamView> result = examController.getAllExams();

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("Matematyka", result.get(0).getTitle());
    }

    @Test
    void getExam() {
        Exam exam = exam(2L, "Geografia");
        when(examService.getExamById(2L)).thenReturn(exam);

        ExamView result = examController.getExam(2L);

        assertEquals(2L, result.getId());
        assertEquals("Geografia", result.getTitle());
    }

    @Test
    void createExam() {
        CreateExamRequest request = new CreateExamRequest();
        request.setTitle("Historia");
        request.setDurationMinutes(20);
        request.setQuestionIds(List.of(1L));
        Exam savedExam = exam(3L, "Historia");

        when(examService.createExam(request)).thenReturn(savedExam);

        ExamView result = examController.createExam(request);

        assertEquals(3L, result.getId());
        assertEquals("Historia", result.getTitle());
    }

    @Test
    void submitExam() {
        Exam exam = exam(4L, "Java");
        ExamSubmission submission = new ExamSubmission();
        submission.setExamId(4L);
        submission.setUserId(9L);
        submission.setAnswers(Map.of(1L, "A"));

        when(examRepository.findById(4L)).thenReturn(Optional.of(exam));
        when(gradingService.calculateScore(submission.getAnswers())).thenReturn(1);
        when(gradingService.calculateMaxScore(exam)).thenReturn(2);
        when(attemptRepository.save(any(Attempt.class))).thenAnswer(invocation -> {
            Attempt attempt = invocation.getArgument(0);
            attempt.setId(15L);
            return attempt;
        });

        SubmissionResult result = examController.submitExam(submission);

        verify(attemptRepository).save(any(Attempt.class));
        assertEquals(15L, result.getAttemptId());
        assertEquals(1, result.getScore());
        assertEquals("Zaliczony", result.getStatus());
    }

    @Test
    void getUserResults() {
        Attempt attempt = attempt(1L, 7L, 10L, 4, 5);
        Exam exam = exam(10L, "Matematyka");

        when(attemptRepository.findAllByUserIdOrderBySubmittedAtDesc(7L)).thenReturn(List.of(attempt));
        when(examRepository.findById(10L)).thenReturn(Optional.of(exam));

        List<ResultResponse> result = examController.getResults(7L);

        assertEquals(1, result.size());
        assertEquals("Matematyka", result.get(0).getTitle());
        assertEquals(80, result.get(0).getPercentage());
        assertEquals("Zaliczony", result.get(0).getStatus());
    }

    private Exam exam(Long id, String title) {
        Exam exam = new Exam();
        exam.setId(id);
        exam.setTitle(title);
        exam.setDurationMinutes(30);
        exam.setQuestionsList(List.of(question(1L), question(2L)));
        return exam;
    }

    private Question question(Long id) {
        Question question = new Question();
        question.setId(id);
        question.setContent("Question " + id);
        question.setOptions(List.of("A", "B"));
        question.setCorrect("A");
        question.setPoints(1);
        return question;
    }

    private Attempt attempt(Long id, Long userId, Long examId, int score, int maxScore) {
        Attempt attempt = new Attempt();
        attempt.setId(id);
        attempt.setUserId(userId);
        attempt.setExamId(examId);
        attempt.setScore(score);
        attempt.setMaxScore(maxScore);
        attempt.setSubmittedAt(LocalDateTime.of(2026, 6, 13, 10, 0));
        return attempt;
    }
}

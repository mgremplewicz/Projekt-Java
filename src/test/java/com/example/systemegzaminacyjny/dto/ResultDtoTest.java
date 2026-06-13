package com.example.systemegzaminacyjny.dto;

import com.example.systemegzaminacyjny.model.Attempt;
import com.example.systemegzaminacyjny.model.Exam;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ResultDtoTest {

    @Test
    void passedResult() {
        SubmissionResult result = new SubmissionResult(1L, 3, 5);

        assertEquals(1L, result.getAttemptId());
        assertEquals(60, result.getPercentage());
        assertEquals("Zaliczony", result.getStatus());
    }

    @Test
    void failedResult() {
        SubmissionResult result = new SubmissionResult(1L, 0, 0);

        assertEquals(0, result.getPercentage());
        assertEquals("Niezaliczony", result.getStatus());
    }

    @Test
    void resultWithUsername() {
        LocalDateTime submittedAt = LocalDateTime.of(2026, 6, 13, 10, 0);
        Attempt attempt = new Attempt();
        attempt.setId(5L);
        attempt.setScore(2);
        attempt.setMaxScore(5);
        attempt.setSubmittedAt(submittedAt);
        Exam exam = new Exam();
        exam.setTitle("Egzamin");

        ResultResponse result = new ResultResponse(attempt, exam, "student");

        assertEquals(5L, result.getId());
        assertEquals("student", result.getUsername());
        assertEquals("Egzamin", result.getTitle());
        assertEquals(submittedAt, result.getSubmittedAt());
        assertEquals(40, result.getPercentage());
        assertEquals("Niezaliczony", result.getStatus());
    }
}

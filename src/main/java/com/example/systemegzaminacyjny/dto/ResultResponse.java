package com.example.systemegzaminacyjny.dto;

import com.example.systemegzaminacyjny.model.Attempt;
import com.example.systemegzaminacyjny.model.Exam;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ResultResponse {
    private final Long id;
    private final String username;
    private final String title;
    private final LocalDateTime submittedAt;
    private final int score;
    private final int maxScore;
    private final int percentage;
    private final String status;

    public ResultResponse(Attempt attempt, Exam exam) {
        this(attempt, exam, null);
    }

    public ResultResponse(Attempt attempt, Exam exam, String username) {
        this.id = attempt.getId();
        this.username = username;
        this.title = exam.getTitle();
        this.submittedAt = attempt.getSubmittedAt();
        this.score = attempt.getScore();
        this.maxScore = attempt.getMaxScore();
        this.percentage = maxScore == 0 ? 0 : Math.round((score * 100f) / maxScore);
        this.status = this.percentage >= 50 ? "Zaliczony" : "Niezaliczony";
    }
}

package com.example.systemegzaminacyjny.dto;

import lombok.Getter;

@Getter
public class SubmissionResult {
    private final Long attemptId;
    private final int score;
    private final int maxScore;
    private final int percentage;
    private final String status;

    public SubmissionResult(Long attemptId, int score, int maxScore) {
        this.attemptId = attemptId;
        this.score = score;
        this.maxScore = maxScore;
        this.percentage = maxScore == 0 ? 0 : Math.round((score * 100f) / maxScore);
        this.status = this.percentage >= 50 ? "Zaliczony" : "Niezaliczony";
    }
}

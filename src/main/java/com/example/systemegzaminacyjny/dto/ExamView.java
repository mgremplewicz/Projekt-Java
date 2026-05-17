package com.example.systemegzaminacyjny.dto;

import com.example.systemegzaminacyjny.model.Exam;
import lombok.Getter;

import java.util.List;

@Getter
public class ExamView {
    private final Long id;
    private final String title;
    private final int durationMinutes;
    private final List<QuestionView> questionsList;

    public ExamView(Exam exam) {
        this.id = exam.getId();
        this.title = exam.getTitle();
        this.durationMinutes = exam.getDurationMinutes();
        this.questionsList = exam.getQuestionsList().stream()
                .map(QuestionView::new)
                .toList();
    }
}

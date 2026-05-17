package com.example.systemegzaminacyjny.dto;

import com.example.systemegzaminacyjny.model.Question;
import lombok.Getter;

import java.util.List;

@Getter
public class QuestionView {
    private final Long id;
    private final String content;
    private final List<String> options;
    private final int points;

    public QuestionView(Question question) {
        this.id = question.getId();
        this.content = question.getContent();
        this.options = question.getOptions();
        this.points = question.getPoints();
    }
}

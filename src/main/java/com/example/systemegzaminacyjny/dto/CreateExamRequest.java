package com.example.systemegzaminacyjny.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class CreateExamRequest {
    private String title;
    private int durationMinutes;
    private List<Long> questionIds;
}

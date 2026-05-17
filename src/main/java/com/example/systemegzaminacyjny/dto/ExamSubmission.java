package com.example.systemegzaminacyjny.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Setter
@Getter

public class ExamSubmission
{
    private Long examId;
    private Long userId;

    private Map<Long, String> answers;

}
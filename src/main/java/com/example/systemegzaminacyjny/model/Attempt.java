package com.example.systemegzaminacyjny.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter

@Entity

public class Attempt
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private Long userId;
    private Long examId;
    private int score;
    private int maxScore;

    private LocalDateTime startTime;
    private LocalDateTime submittedAt;

}

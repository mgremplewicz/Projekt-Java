package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.model.Attempt;
import com.example.systemegzaminacyjny.repository.AttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TimerService {
    @Autowired
    private AttemptRepository attemptRepository;

    public boolean isTimeValid(Attempt attempt, int durationMinutes) {
        LocalDateTime now = LocalDateTime.now();
        return now.isBefore(attempt.getStartTime().plusMinutes(durationMinutes));
    }
}
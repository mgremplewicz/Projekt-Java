package com.example.systemegzaminacyjny.controller;

import com.example.systemegzaminacyjny.dto.ExamSubmission;
import com.example.systemegzaminacyjny.dto.ExamView;
import com.example.systemegzaminacyjny.dto.ResultResponse;
import com.example.systemegzaminacyjny.dto.SubmissionResult;
import com.example.systemegzaminacyjny.model.Attempt;
import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.repository.AttemptRepository;
import com.example.systemegzaminacyjny.repository.ExamRepository;
import com.example.systemegzaminacyjny.service.ExamService;
import com.example.systemegzaminacyjny.service.GradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})

public class ExamController
{
    @Autowired
    private ExamService examService;
    @Autowired
    private GradingService gradingService;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private AttemptRepository attemptRepository;

    @GetMapping
    public List<ExamView> getAllExams() {
        return examService.getAllExams().stream()
                .map(ExamView::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ExamView getExam(@PathVariable Long id) {
        return new ExamView(examService.getExamById(id));
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examService.createExam(exam);
    }

    @PostMapping("/submit")
    public SubmissionResult submitExam(@RequestBody ExamSubmission submission) {
        Exam exam = examRepository.findById(submission.getExamId()).orElseThrow();
        int score = gradingService.calculateScore(submission.getAnswers());
        int maxScore = gradingService.calculateMaxScore(exam);

        Attempt attempt = new Attempt();
        attempt.setExamId(submission.getExamId());
        attempt.setUserId(submission.getUserId());
        attempt.setScore(score);
        attempt.setMaxScore(maxScore);
        attempt.setStartTime(LocalDateTime.now());
        attempt.setSubmittedAt(LocalDateTime.now());
        Attempt savedAttempt = attemptRepository.save(attempt);

        return new SubmissionResult(savedAttempt.getId(), score, maxScore);
    }

    @GetMapping("/results/{userId}")
    public List<ResultResponse> getResults(@PathVariable Long userId) {
        return attemptRepository.findByUserIdOrderBySubmittedAtDesc(userId).stream()
                .map(attempt -> {
                    Exam exam = examRepository.findById(attempt.getExamId()).orElseThrow();
                    return new ResultResponse(attempt, exam);
                })
                .toList();
    }
}

package com.example.systemegzaminacyjny.service;

import com.example.systemegzaminacyjny.dto.CreateExamRequest;
import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.repository.ExamRepository;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class ExamService
{
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private QuestionRepository questionRepository;

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    public Exam createExam(CreateExamRequest request) {
        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());

        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setQuestionsList(questions);

        return examRepository.save(exam);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam getExamById(Long id) {
        Exam exam = examRepository.findById(id).orElseThrow();
        Collections.shuffle(exam.getQuestionsList());
        return exam;
    }
}

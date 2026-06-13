package com.example.systemegzaminacyjny.config;

import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.ExamRepository;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import com.example.systemegzaminacyjny.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DataInitializerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private ExamRepository examRepository;

    @Test
    void addStartData() {
        DataInitializer initializer = new DataInitializer(userRepository, questionRepository, examRepository);
        when(userRepository.findByUsername(anyString())).thenReturn(null);
        when(questionRepository.count()).thenReturn(0L);
        when(examRepository.count()).thenReturn(0L);
        when(questionRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(examRepository.save(any(Exam.class))).thenAnswer(invocation -> invocation.getArgument(0));

        initializer.run();

        verify(userRepository, times(3)).save(any(User.class));
        verify(questionRepository, times(4)).saveAll(any());
        verify(examRepository, times(4)).save(any(Exam.class));
    }
}

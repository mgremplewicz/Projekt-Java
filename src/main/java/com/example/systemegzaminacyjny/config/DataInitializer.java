package com.example.systemegzaminacyjny.config;

import com.example.systemegzaminacyjny.model.Exam;
import com.example.systemegzaminacyjny.model.Question;
import com.example.systemegzaminacyjny.model.User;
import com.example.systemegzaminacyjny.repository.ExamRepository;
import com.example.systemegzaminacyjny.repository.QuestionRepository;
import com.example.systemegzaminacyjny.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner 
{
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;

    public DataInitializer(
            UserRepository userRepository,
            QuestionRepository questionRepository,
            ExamRepository examRepository
    ) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedExam();
    }

    private void seedUsers() {
        if (userRepository.findByUsername("4gremplewicz") == null) {
            userRepository.save(createUser("4gremplewicz", "12345", "UCZEN"));
        }

        if (userRepository.findByUsername("4bosak") == null) {
            userRepository.save(createUser("4bosak", "12345", "UCZEN"));
        }

        if (userRepository.findByUsername("nauczyciel") == null) {
            userRepository.save(createUser("nauczyciel", "nauczyciel123", "NAUCZYCIEL"));
        }
    }

    private void seedExam() {
        if (questionRepository.count() > 0 || examRepository.count() > 0) {
            return;
        }

        List<Question> questions = questionRepository.saveAll(List.of(
                createQuestion(
                        "2 + 2 = ?",
                        List.of("1", "2", "3", "4"),
                        "4",
                        1
                ),
                createQuestion(
                        "2 * 3 = ?",
                        List.of("2", "4", "6", "8"),
                        "6",
                        1
                ),
                createQuestion(
                        "6 * 6 = ?",
                        List.of("36", "32", "42", "2"),
                        "36",
                        1
                ),
                createQuestion(
                        "25 * 5 = ?",
                        List.of("75", "125", "1", "2"),
                        "125",
                        1
                ),
                createQuestion(
                        "25 / 5 = ?",
                        List.of("75", "55", "2", "5"),
                        "5",
                        1
                ),
                createQuestion(
                        "10 * 10 = ?",
                        List.of("1", "100", "3", "110"),
                        "100",
                        1
                )
        ));

        Exam exam = new Exam();
        exam.setTitle("Egzamin z matematyki");
        exam.setDurationMinutes(30);
        exam.setQuestionsList(questions);
        examRepository.save(exam);


        List<Question> questions2 = questionRepository.saveAll(List.of(
                createQuestion(
                        "Wybierz poprawne zdanie:",
                        List.of("What is your name?", "What is yours name?", "Which is yours name?", "What is name yours?"),
                        "What is your name?",
                        1
                ),
                createQuestion(
                        "Wybierz poprawne zdanie:",
                        List.of("How old are you?", "What old are you?", "What old are I?", "What old am you?"),
                        "How old are you?",
                        1
                ),
                createQuestion(
                        "Wybierz poprawne zdanie:",
                        List.of("Where do you life?", "Where do you live?", "Where do you lives?", "Where do you left?"),
                        "Where do you live?",
                        1
                ),
                createQuestion(
                        "Wybierz poprawne zdanie:",
                        List.of("Where is your best tree?", "What are your favorites food?", "What is your favorite food?", "What is your favoritos foodos?"),
                        "What is your favorite food?",
                        1
                )
        ));

        Exam exam2 = new Exam();
        exam2.setTitle("Egzamin z angielskiego");
        exam2.setDurationMinutes(45);
        exam2.setQuestionsList(questions2);
        examRepository.save(exam2);


    }

    private User createUser(String username, String password, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    private Question createQuestion(String content, List<String> options, String correct, int points) {
        Question question = new Question();
        question.setContent(content);
        question.setOptions(options);
        question.setCorrect(correct);
        question.setPoints(points);
        return question;
    }
}

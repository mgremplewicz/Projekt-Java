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
        exam.setDurationMinutes(10);
        exam.setQuestionsList(questions);
        examRepository.save(exam);


        List<Question> questions2 = questionRepository.saveAll(List.of(
                createQuestion(
                        "2 + 3 = ?",
                        List.of("4", "5", "6", "7"),
                        "5",
                        1
                ),
                createQuestion(
                        "4 + 5 = ?",
                        List.of("8", "9", "10", "7"),
                        "9",
                        1
                ),
                createQuestion(
                        "7 + 2 = ?",
                        List.of("8", "9", "10", "11"),
                        "9",
                        1
                ),
                createQuestion(
                        "6 + 8 = ?",
                        List.of("12", "13", "14", "15"),
                        "14",
                        1
                ),
                createQuestion(
                        "9 + 3 = ?",
                        List.of("11", "12", "13", "14"),
                        "12",
                        1
                ),
                createQuestion(
                        "10 + 5 = ?",
                        List.of("13", "14", "15", "16"),
                        "15",
                        1
                ),
                createQuestion(
                        "12 + 4 = ?",
                        List.of("14", "15", "16", "17"),
                        "16",
                        1
                ),
                createQuestion(
                        "8 + 7 = ?",
                        List.of("13", "14", "15", "16"),
                        "15",
                        1
                ),
                createQuestion(
                        "11 + 6 = ?",
                        List.of("16", "17", "18", "19"),
                        "17",
                        1
                ),
                createQuestion(
                        "13 + 5 = ?",
                        List.of("17", "18", "19", "20"),
                        "18",
                        1
                )
        ));

        Exam exam2 = new Exam();
        exam2.setTitle("Egzamin z dodawania");
        exam2.setDurationMinutes(5);
        exam2.setQuestionsList(questions2);
        examRepository.save(exam2);

        List<Question> questions3 = questionRepository.saveAll(List.of(
                createQuestion(
                        "5 - 2 = ?",
                        List.of("2", "3", "4", "5"),
                        "3",
                        1
                ),
                createQuestion(
                        "8 - 3 = ?",
                        List.of("4", "5", "6", "7"),
                        "5",
                        1
                ),
                createQuestion(
                        "10 - 4 = ?",
                        List.of("5", "6", "7", "8"),
                        "6",
                        1
                ),
                createQuestion(
                        "12 - 7 = ?",
                        List.of("4", "5", "6", "7"),
                        "5",
                        1
                ),
                createQuestion(
                        "15 - 6 = ?",
                        List.of("8", "9", "10", "11"),
                        "9",
                        1
                ),
                createQuestion(
                        "20 - 8 = ?",
                        List.of("10", "11", "12", "13"),
                        "12",
                        1
                ),
                createQuestion(
                        "18 - 9 = ?",
                        List.of("7", "8", "9", "10"),
                        "9",
                        1
                ),
                createQuestion(
                        "25 - 10 = ?",
                        List.of("13", "14", "15", "16"),
                        "15",
                        1
                ),
                createQuestion(
                        "30 - 12 = ?",
                        List.of("16", "17", "18", "19"),
                        "18",
                        1
                ),
                createQuestion(
                        "22 - 5 = ?",
                        List.of("15", "16", "17", "18"),
                        "17",
                        1
                ),
                createQuestion(
                        "40 - 15 = ?",
                        List.of("23", "24", "25", "26"),
                        "25",
                        1
                ),
                createQuestion(
                        "35 - 18 = ?",
                        List.of("15", "16", "17", "18"),
                        "17",
                        1
                ),
                createQuestion(
                        "50 - 20 = ?",
                        List.of("25", "30", "35", "40"),
                        "30",
                        1
                ),
                createQuestion(
                        "45 - 13 = ?",
                        List.of("30", "31", "32", "33"),
                        "32",
                        1
                ),
                createQuestion(
                        "60 - 25 = ?",
                        List.of("33", "34", "35", "36"),
                        "35",
                        1
                )
        ));

        Exam exam3 = new Exam();
        exam3.setTitle("Egzamin z odejmowania");
        exam3.setDurationMinutes(5);
        exam3.setQuestionsList(questions3);
        examRepository.save(exam3);

        List<Question> questions4 = questionRepository.saveAll(List.of(
                createQuestion(
                        "Jaka jest stolica Polski?",
                        List.of("Kraków", "Warszawa", "Gdańsk", "Poznań"),
                        "Warszawa",
                        1
                ),
                createQuestion(
                        "Który kontynent jest największy?",
                        List.of("Afryka", "Azja", "Europa", "Australia"),
                        "Azja",
                        1
                ),
                createQuestion(
                        "Jaka jest najdłuższa rzeka w Polsce?",
                        List.of("Odra", "Wisła", "Warta", "Bug"),
                        "Wisła",
                        1
                ),
                createQuestion(
                        "Który ocean jest największy?",
                        List.of("Atlantycki", "Indyjski", "Spokojny", "Arktyczny"),
                        "Spokojny",
                        1
                ),
                createQuestion(
                        "Jak nazywa się najwyższy szczyt Polski?",
                        List.of("Rysy", "Śnieżka", "Giewont", "Babia Góra"),
                        "Rysy",
                        1
                ),
                createQuestion(
                        "Które państwo ma stolicę w Berlinie?",
                        List.of("Francja", "Niemcy", "Austria", "Szwajcaria"),
                        "Niemcy",
                        1
                ),
                createQuestion(
                        "Na którym kontynencie leży Egipt?",
                        List.of("Azja", "Afryka", "Europa", "Ameryka Południowa"),
                        "Afryka",
                        1
                ),
                createQuestion(
                        "Jak nazywa się największa pustynia na świecie?",
                        List.of("Gobi", "Sahara", "Kalahari", "Atakama"),
                        "Sahara",
                        1
                ),
                createQuestion(
                        "Które morze leży na północy Polski?",
                        List.of("Morze Czarne", "Morze Bałtyckie", "Morze Śródziemne", "Morze Północne"),
                        "Morze Bałtyckie",
                        1
                ),
                createQuestion(
                        "Jaka jest stolica Francji?",
                        List.of("Madryt", "Rzym", "Paryż", "Berlin"),
                        "Paryż",
                        1
                ),
                createQuestion(
                        "Który kraj ma kształt buta?",
                        List.of("Hiszpania", "Włochy", "Grecja", "Portugalia"),
                        "Włochy",
                        1
                ),
                createQuestion(
                        "Jak nazywa się największa wyspa świata?",
                        List.of("Madagaskar", "Grenlandia", "Islandia", "Wielka Brytania"),
                        "Grenlandia",
                        1
                )
        ));

        Exam exam4 = new Exam();
        exam4.setTitle("Egzamin z geografii");
        exam4.setDurationMinutes(10);
        exam4.setQuestionsList(questions4);
        examRepository.save(exam4);
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

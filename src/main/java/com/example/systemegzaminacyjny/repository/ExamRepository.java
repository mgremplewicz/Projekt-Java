package com.example.systemegzaminacyjny.repository;

import com.example.systemegzaminacyjny.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long>
{
}
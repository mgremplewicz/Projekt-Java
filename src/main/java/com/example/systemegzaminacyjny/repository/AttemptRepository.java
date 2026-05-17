package com.example.systemegzaminacyjny.repository;

import com.example.systemegzaminacyjny.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long>
{
    List<Attempt> findByUserIdOrderBySubmittedAtDesc(Long userId);
}

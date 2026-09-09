package com.application.core.expense.repository;

import com.application.core.expense.entities.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("select e from Expense e where e.active = true")
    List<Expense> findAllActive();

    @Query("select e from Expense e where e.active = true")
    Page<Expense> findAllActive(Pageable pageable);

    boolean existsByCode(String code);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.active = true")
    Double sumTotalExpenseHT();

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.active = true and e.date >= :startDate and e.date <= :endDate")
    Double sumTotalExpenseHT(Date startDate, Date endDate);

    @Query("SELECT COALESCE(SUM(e.amount * (1 + COALESCE(t.rate, 0))), 0.0) " +
            "FROM Expense e " +
            "LEFT JOIN e.tax t " +
            "WHERE e.active = true")
    Double sumTotalExpenseTTC();

    @Query("SELECT COALESCE(SUM(e.amount * (1 + COALESCE(t.rate, 0))), 0.0) " +
            "FROM Expense e " +
            "LEFT JOIN e.tax t " +
            "WHERE e.active = true and e.date >= :startDate and e.date <= :endDate")
    Double sumTotalExpenseTTC(Date startDate, Date endDate);
}

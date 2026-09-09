package com.application.core.expense.repository;

import com.application.core.expense.entities.ExpenseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseTypeRepository extends JpaRepository<ExpenseType, Long> {
    @Query("select expenseType from ExpenseType expenseType where expenseType.active = true")
    List<ExpenseType> findAllActive();

    @Query("select expenseType from ExpenseType expenseType where expenseType.active = true")
    Page<ExpenseType> findAllActive(Pageable pageable);
}

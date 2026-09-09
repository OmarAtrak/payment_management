package com.application.core.expense.services;

import com.application.core.expense.entities.Expense;
import com.application.core.expense.repository.ExpenseRepository;
import com.application.core.product.entities.Tax;
import com.application.core.product.repository.TaxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final TaxRepository taxRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, TaxRepository taxRepository) {
        this.expenseRepository = expenseRepository;
        this.taxRepository = taxRepository;
    }

    public List<Expense> findAll() {
        return expenseRepository.findAllActive();
    }

    public Page<Expense> findAll(Pageable pageable) {
        return expenseRepository.findAllActive(pageable);
    }

    public Expense findById(Long id) {
        return expenseRepository.findById(id).get();
    }

    public Expense save(Expense expense) {
        if (expense.getTax() != null && expense.getTax().getId() != null) {
            Tax managedTax = taxRepository.findById(expense.getTax().getId()).orElse(null);
            expense.setTax(managedTax);
        }
        if (expense.getCode() == null || expense.getCode().isEmpty()) {
            expense.setCode(generateUniqueCode());
        }
        return expenseRepository.save(expense);
    }

    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            int randomNumber = (int)(Math.random() * 1000000);
            code = "EXP-" + String.format("%06d", randomNumber);
            attempts++;

            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique expense code after " + maxAttempts + " attempts");
            }
        } while (expenseRepository.existsByCode(code));

        return code;
    }
}

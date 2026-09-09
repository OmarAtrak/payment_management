package com.application.core.expense.services;

import com.application.core.expense.entities.ExpenseType;
import com.application.core.expense.repository.ExpenseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseTypeService {
    private final ExpenseTypeRepository expenseTypeRepository;

    @Autowired
    public ExpenseTypeService(ExpenseTypeRepository expenseTypeRepository) {
        this.expenseTypeRepository = expenseTypeRepository;
    }

    public List<ExpenseType> findAll() {
        return expenseTypeRepository.findAllActive();
    }

    public Page<ExpenseType> findAll(Pageable pageable) {
        return expenseTypeRepository.findAllActive(pageable);
    }

    public ExpenseType findById(Long id) {
        return expenseTypeRepository.findById(id).get();
    }

    public ExpenseType save(ExpenseType expenseType) {
        return expenseTypeRepository.save(expenseType);
    }
}

package com.application.core.expense.controller;

import com.application.core.expense.entities.Expense;
import com.application.core.expense.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/index")
    public Page<Expense> getAll(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return expenseService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getById(@PathVariable Long id) {
        Expense expenseType = expenseService.findById(id);
        if (expenseType == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expenseType);
    }

    @PostMapping("/save")
    public Expense create(@RequestBody Expense expense) {
        return expenseService.save(expense);
    }

    @PutMapping("/update")
    public ResponseEntity<Expense> update(@RequestBody Expense expense) {
        Expense updatedExpense = expenseService.findById(expense.getId());
        if (updatedExpense == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expenseService.save(expense));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Expense> delete(@PathVariable Long id) {
        Expense expenseType = expenseService.findById(id);
        if (expenseType == null) {
            return ResponseEntity.notFound().build();
        }
        expenseType.setActive(false);
        Expense updatedCategory = expenseService.save(expenseType);
        return ResponseEntity.ok(updatedCategory);
    }
}

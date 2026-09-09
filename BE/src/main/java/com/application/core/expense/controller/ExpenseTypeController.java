package com.application.core.expense.controller;

import com.application.core.expense.entities.ExpenseType;
import com.application.core.expense.services.ExpenseTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expense/types")
public class ExpenseTypeController {
    private final ExpenseTypeService expenseTypeService;

    @Autowired
    public ExpenseTypeController(ExpenseTypeService expenseTypeService) {
        this.expenseTypeService = expenseTypeService;
    }

    @GetMapping("/index")
    public Page<ExpenseType> getAll(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return expenseTypeService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseType> getById(@PathVariable Long id) {
        ExpenseType expenseType = expenseTypeService.findById(id);
        if (expenseType == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expenseType);
    }

    @PostMapping("/save")
    public ExpenseType create(@RequestBody ExpenseType expenseType) {
        return expenseTypeService.save(expenseType);
    }

    @PutMapping("/update")
    public ResponseEntity<ExpenseType> update(@RequestBody ExpenseType expenseType) {
        ExpenseType updatedExpenseType = expenseTypeService.findById(expenseType.getId());
        if (updatedExpenseType == null) {
            return ResponseEntity.notFound().build();
        }
        updatedExpenseType.setName(expenseType.getName());
        updatedExpenseType.setActive(expenseType.getActive());
        return ResponseEntity.ok(expenseTypeService.save(updatedExpenseType));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ExpenseType> delete(@PathVariable Long id) {
        ExpenseType expenseType = expenseTypeService.findById(id);
        if (expenseType == null) {
            return ResponseEntity.notFound().build();
        }
        expenseType.setActive(false);
        ExpenseType updatedCategory = expenseTypeService.save(expenseType);
        return ResponseEntity.ok(updatedCategory);
    }
}

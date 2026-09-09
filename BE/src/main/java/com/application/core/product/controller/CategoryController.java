package com.application.core.product.controller;

import com.application.core.product.entities.Category;
import com.application.core.product.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/index")
    public Page<Category> getAll(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return categoryService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        Category tax = categoryService.findById(id);
        if (tax == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tax);
    }

    @PostMapping("/save")
    public Category create(@RequestBody Category tax) {
        return categoryService.save(tax);
    }

    @PutMapping("/update")
    public ResponseEntity<Category> update(@RequestBody Category tax) {
        Category updatedCategory = categoryService.findById(tax.getId());
        if (updatedCategory == null) {
            return ResponseEntity.notFound().build();
        }
        updatedCategory.setName(tax.getName());
        updatedCategory.setActive(tax.getActive());
        return ResponseEntity.ok(categoryService.save(updatedCategory));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Category> delete(@PathVariable Long id) {
        Category tax = categoryService.findById(id);
        if (tax == null) {
            return ResponseEntity.notFound().build();
        }
        tax.setActive(false);
        Category updatedCategory = categoryService.save(tax);
        return ResponseEntity.ok(updatedCategory);
    }
}

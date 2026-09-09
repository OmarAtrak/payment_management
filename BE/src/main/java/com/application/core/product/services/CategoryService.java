package com.application.core.product.services;

import com.application.core.product.entities.Category;
import com.application.core.product.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAllActive();
    }

    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAllActive(pageable);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).get();
    }

    public Category save(Category product) {
        return categoryRepository.save(product);
    }
}

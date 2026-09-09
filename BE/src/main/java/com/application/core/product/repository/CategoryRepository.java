package com.application.core.product.repository;

import com.application.core.product.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select c from Category c where c.active = true")
    List<Category> findAllActive();

    @Query("select c from Category c where c.active = true")
    Page<Category> findAllActive(Pageable pageable);
}

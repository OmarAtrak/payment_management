package com.application.core.product.repository;

import com.application.core.product.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("select p from Product p where p.active = true")
    List<Product> findAllActive();

    @Query("select p from Product p where p.active = true")
    Page<Product> findAllActive(Pageable pageable);
}

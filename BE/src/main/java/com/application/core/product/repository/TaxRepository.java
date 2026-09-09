package com.application.core.product.repository;

import com.application.core.product.entities.Tax;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaxRepository extends JpaRepository<Tax,Long> {
    @Query("select t from Tax t where t.active = true")
    List<Tax> findAllActive();

    @Query("select t from Tax t where t.active = true")
    Page<Tax> findAllActive(Pageable pageable);
}

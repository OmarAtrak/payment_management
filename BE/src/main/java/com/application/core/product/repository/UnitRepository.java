package com.application.core.product.repository;

import com.application.core.product.entities.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    @Query("select u from Unit u where u.active = true")
    List<Unit> findAllActive();

    @Query("select u from Unit u where u.active = true")
    Page<Unit> findAllActive(Pageable pageable);
}

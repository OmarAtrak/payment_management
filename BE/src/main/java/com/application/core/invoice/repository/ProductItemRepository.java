package com.application.core.invoice.repository;

import com.application.core.invoice.entity.ProductItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    @Query("select p from ProductItem p where p.active = true")
    List<ProductItem> findAllActive();

    @Query("select p from ProductItem p where p.active = true")
    Page<ProductItem> findAllActive(Pageable pageable);

    @Query("""
       SELECT COALESCE(SUM(COALESCE(p.priceTtc,0) - COALESCE(p.priceHt,0)), 0)
       FROM ProductItem p
       JOIN p.invoice i
       WHERE p.active = true
       AND i.active = true
       AND i.status = 1
    """)
    Double sumTotalVAT();

    @Query("""
       SELECT COALESCE(SUM(COALESCE(p.priceTtc,0) - COALESCE(p.priceHt,0)), 0)
       FROM ProductItem p
       JOIN p.invoice i
       WHERE p.active = true
       AND i.active = true
       AND i.status = 1
       AND p.invoice.date >= :startDate
       AND p.invoice.date <= :endDate
    """)
    Double sumTotalVAT(Date startDate, Date endDate);

    @Query("""
       SELECT COALESCE(SUM(COALESCE(p.priceHt,0)), 0)
       FROM ProductItem p
       JOIN p.invoice i
       WHERE p.active = true
       AND i.active = true
       AND i.status = 1
    """)
    Double sumTotalHT();

    @Query("""
       SELECT COALESCE(SUM(COALESCE(p.priceHt,0)), 0)
       FROM ProductItem p
       JOIN p.invoice i
       WHERE p.active = true
       AND i.active = true
       AND i.status = 1
       AND p.invoice.date >= :startDate
       AND p.invoice.date <= :endDate
    """)
    Double sumTotalHT(Date startDate, Date endDate);
}

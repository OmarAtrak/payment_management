package com.application.core.invoice.repository;

import com.application.core.invoice.entity.ServiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    @Query("select s from ServiceItem s where s.active = true")
    List<ServiceItem> findAllActive();

    @Query("select s from ServiceItem s where s.active = true")
    Page<ServiceItem> findAllActive(Pageable pageable);

    @Query("""
       SELECT COALESCE(SUM(COALESCE(s.priceTtc,0) - COALESCE(s.price,0)), 0)
       FROM ServiceItem s
       JOIN s.invoice i
       WHERE s.active = true
       AND i.active = true
       AND i.status = 1
    """)
    Double sumTotalVAT();

    @Query("""
       SELECT COALESCE(SUM(COALESCE(s.priceTtc,0) - COALESCE(s.price,0)), 0)
       FROM ServiceItem s
       JOIN s.invoice i
       WHERE s.active = true
       AND i.active = true
       AND i.status = 1
       AND s.invoice.date >= :startDate
       AND s.invoice.date <= :endDate
    """)
    Double sumTotalVAT(Date startDate, Date endDate);

    @Query("""
       SELECT COALESCE(SUM(COALESCE(s.price,0)), 0)
       FROM ServiceItem s
       JOIN s.invoice i
       WHERE s.active = true
       AND i.active = true
       AND i.status = 1
    """)
    Double sumTotalHT();

    @Query("""
       SELECT COALESCE(SUM(COALESCE(s.price,0)), 0)
       FROM ServiceItem s
       JOIN s.invoice i
       WHERE s.active = true
       AND i.active = true
       AND i.status = 1
       AND s.invoice.date >= :startDate
       AND s.invoice.date <= :endDate
    """)
    Double sumTotalHT(Date startDate, Date endDate);
}

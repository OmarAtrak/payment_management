package com.application.core.invoice.repository;

import com.application.core.invoice.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("select p from Payment p where p.active = true")
    List<Payment> findAllActive();

    @Query("select p from Payment p where p.active = true")
    Page<Payment> findAllActive(Pageable pageable);

    boolean existsByCode(String code);

    @Query("""
       SELECT COALESCE(SUM(p.amount), 0)
       FROM Payment p
       INNER JOIN p.invoice i
       WHERE p.active = true
       AND p.status = 1
       AND i.active = true
       AND i.status = 1
    """)
    Double sumTotalPayment();

    @Query("""
       SELECT COALESCE(SUM(p.amount), 0)
       FROM Payment p
       INNER JOIN p.invoice i
       WHERE p.active = true
       AND p.status = 1
       AND i.active = true
       AND i.status = 1
       AND p.date >= :startDate
       AND p.date <= :endDate
    """)
    Double sumTotalPayment(Date startDate, Date endDate);
}

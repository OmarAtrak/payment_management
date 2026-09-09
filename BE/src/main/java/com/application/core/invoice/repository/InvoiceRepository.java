package com.application.core.invoice.repository;

import com.application.core.invoice.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    @Query("select i from Invoice i where i.active = true")
    List<Invoice> findAllActive();

    @Query("select i from Invoice i where i.active = true")
    Page<Invoice> findAllActive(Pageable pageable);

    boolean existsByCode(String code);
}

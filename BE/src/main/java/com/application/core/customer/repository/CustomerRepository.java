package com.application.core.customer.repository;

import com.application.core.customer.dto.TopCustomerDTO;
import com.application.core.customer.entities.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("select c from Customer c where c.active = true")
    List<Customer> findAllActive();

    @Query("select c from Customer c where c.active = true")
    Page<Customer> findAllActive(Pageable pageable);

    boolean existsByCode(String code);

    @Query("""
        SELECT new com.application.core.customer.dto.TopCustomerDTO(
            c.id,
            c.name,
            COUNT(DISTINCT i.id),
            COALESCE(SUM(p.amount), 0),
            MAX(i.date),
            c.hasLoyaltyCard
        )
        FROM Customer c
        LEFT JOIN Invoice i
            ON i.customer = c AND i.active = true
        LEFT JOIN Payment p
            ON p.invoice = i AND p.active = true AND p.status = 1
        WHERE c.active = true
        GROUP BY c.id, c.name
        ORDER BY COUNT(DISTINCT i.id) DESC
    """)
    Page<TopCustomerDTO> findTopCustomers(Pageable pageable);
}

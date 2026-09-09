package com.application.core.customer.repository;

import com.application.core.customer.entities.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("select v from Vehicle v where v.active = true")
    List<Vehicle> findAllActive();

    @Query("select v from Vehicle v where v.active = true")
    Page<Vehicle> findAllActive(Pageable pageable);
}

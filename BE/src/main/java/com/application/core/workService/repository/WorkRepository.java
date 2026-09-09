package com.application.core.workService.repository;

import com.application.core.workService.dto.TopWorkDTO;
import com.application.core.workService.entities.Work;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkRepository extends JpaRepository<Work, Long> {
    @Query("select p from Work p where p.active = true")
    List<Work> findAllActive();

    @Query("select p from Work p where p.active = true")
    Page<Work> findAllActive(Pageable pageable);

    @Query("""
        SELECT new com.application.core.workService.dto.TopWorkDTO(
           w.id,
           w.name,
           w.code,
           COUNT(si.id)
        )
        FROM com.application.core.invoice.entity.ServiceItem si
        JOIN si.service w
        JOIN si.invoice i
        WHERE si.active = true
          AND w.active = true
          AND i.active = true
          AND i.status = 1
        GROUP BY w.id, w.name, w.code
    """)
    Page<TopWorkDTO> findTopRequestedService(Pageable pageable);
}

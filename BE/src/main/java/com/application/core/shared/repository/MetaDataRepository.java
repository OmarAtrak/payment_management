package com.application.core.shared.repository;

import com.application.core.shared.entities.MetaData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaDataRepository extends JpaRepository<MetaData, Long> {
    List<MetaData> findByActiveTrue();

    MetaData findOneById(Long id);

    MetaData findTopByOrderByIdDesc();

    MetaData findTopByOrderByIdAsc();
}
package com.application.core.shared.repository;

import com.application.core.shared.entities.DocumentGenerator;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentGeneratorRepository extends JpaRepository<DocumentGenerator, Long> {

    List<DocumentGenerator> findByActiveTrue();

    DocumentGenerator findOneById(Long id);

    List<DocumentGenerator>  findByActiveTrueAndTypeLike(String type);

    List<DocumentGenerator> findByActiveTrueAndType(String type);

    DocumentGenerator findTopByOrderByIdDesc();
}
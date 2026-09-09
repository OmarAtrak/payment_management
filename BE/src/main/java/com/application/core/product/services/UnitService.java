package com.application.core.product.services;

import com.application.core.product.entities.Unit;
import com.application.core.product.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitService {
    private final UnitRepository unitRepository;

    @Autowired
    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    public List<Unit> findAll() {
        return unitRepository.findAllActive();
    }

    public Page<Unit> findAll(Pageable pageable) {
        return unitRepository.findAllActive(pageable);
    }

    public Unit findById(Long id) {
        return unitRepository.findById(id).get();
    }

    public Unit save(Unit product) {
        return unitRepository.save(product);
    }
}

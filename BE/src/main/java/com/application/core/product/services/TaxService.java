package com.application.core.product.services;

import com.application.core.product.entities.Tax;
import com.application.core.product.repository.TaxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaxService {
    private final TaxRepository taxRepository;

    @Autowired
    public TaxService(TaxRepository taxRepository) {
        this.taxRepository = taxRepository;
    }

    public List<Tax> findAll() {
        return taxRepository.findAllActive();
    }

    public Page<Tax> findAll(Pageable pageable) {
        return taxRepository.findAllActive(pageable);
    }

    public Tax findById(Long id) {
        return taxRepository.findById(id).get();
    }

    public Tax save(Tax tax) {
        return taxRepository.save(tax);
    }
}

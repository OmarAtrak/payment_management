package com.application.core.invoice.service;

import com.application.core.invoice.entity.ProductItem;
import com.application.core.invoice.repository.ProductItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductItemService {
    private final ProductItemRepository productItemRepository;

    @Autowired
    public ProductItemService(ProductItemRepository productItemRepository) {
        this.productItemRepository = productItemRepository;
    }

    public List<ProductItem> findAll() {
        return this.productItemRepository.findAllActive();
    }

    public Page<ProductItem> findAll(Pageable pageable) {
        return this.productItemRepository.findAll(pageable);
    }

    public ProductItem findById(Long id) {
        return this.productItemRepository.findById(id).get();
    }

    public ProductItem save(ProductItem productItem) {
        return this.productItemRepository.save(productItem);
    }
}

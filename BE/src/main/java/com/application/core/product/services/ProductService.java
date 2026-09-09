package com.application.core.product.services;

import com.application.core.product.entities.Product;
import com.application.core.product.entities.Tax;
import com.application.core.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAllActive();
    }

    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAllActive(pageable);
    }

    public Product findById(Long id) {
        return productRepository.findById(id).get();
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }
}

package com.application.core.product.controller;

import com.application.core.product.entities.Product;
import com.application.core.product.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/index")
    public Page<Product> getAll(@RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return productService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping("/save")
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    @PutMapping("/update")
    public ResponseEntity<Product> update(@RequestBody Product product) {
        Product updatedProduct = productService.findById(product.getId());
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productService.save(product));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Product> delete(@PathVariable Long id) {
        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        product.setActive(false);
        Product updatedTax = productService.save(product);
        return ResponseEntity.ok(updatedTax);
    }
}

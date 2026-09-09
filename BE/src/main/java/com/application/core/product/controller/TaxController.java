package com.application.core.product.controller;


import com.application.core.product.entities.Tax;
import com.application.core.product.services.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/taxes")
public class TaxController {
    private final TaxService taxService;

    @Autowired
    public TaxController(TaxService taxService) {
        this.taxService = taxService;
    }

    @GetMapping("/index")
    public Page<Tax> getAll(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return taxService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tax> getById(@PathVariable Long id) {
        Tax tax = taxService.findById(id);
        if (tax == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tax);
    }

    @PostMapping("/save")
    public Tax create(@RequestBody Tax tax) {
        return taxService.save(tax);
    }

    @PutMapping("/update")
    public ResponseEntity<Tax> update(@RequestBody Tax tax) {
        Tax updatedTax = taxService.findById(tax.getId());
        if (updatedTax == null) {
            return ResponseEntity.notFound().build();
        }
        updatedTax.setName(tax.getName());
        updatedTax.setRate(tax.getRate());
        updatedTax.setActive(tax.getActive());
        return ResponseEntity.ok(taxService.save(updatedTax));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Tax> delete(@PathVariable Long id) {
        Tax tax = taxService.findById(id);
        if (tax == null) {
            return ResponseEntity.notFound().build();
        }
        tax.setActive(false);
        Tax updatedTax = taxService.save(tax);
        return ResponseEntity.ok(updatedTax);
    }
}

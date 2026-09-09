package com.application.core.company.controller;

import com.application.core.company.entity.Company;
import com.application.core.company.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable Long id) {
        Company company = companyService.findById(id);
        if (company == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(company);
    }

    @PostMapping("/save")
    public Company create(@RequestBody Company company) {
        return companyService.save(company);
    }

    @PutMapping("/update")
    public ResponseEntity<Company> update(@RequestBody Company company) {
        Company updatedCompany = companyService.findById(company.getId());
        if (updatedCompany == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(companyService.save(company));
    }
}

package com.application.core.company.service;

import com.application.core.company.entity.Company;
import com.application.core.company.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company findById(Long id) {
        return this.companyRepository.findById(id).get();
    }

    public Company save(Company company) {
        return this.companyRepository.save(company);
    }
}

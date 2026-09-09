package com.application.core.customer.services;

import com.application.core.customer.dto.TopCustomerDTO;
import com.application.core.customer.entities.Customer;
import com.application.core.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> findAll() {
        return this.customerRepository.findAllActive();
    }

    public Page<Customer> findAll(Pageable pageable) {
        return this.customerRepository.findAllActive(pageable);
    }

    public Customer findById(Long id) {
        return this.customerRepository.findById(id).get();
    }

    public Customer save(Customer customer) {
        if (customer.getCode() == null || customer.getCode().isEmpty()) {
            customer.setCode(generateUniqueCode());
        }
        return this.customerRepository.save(customer);
    }

    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            int randomNumber = (int)(Math.random() * 1000000);
            code = "CLT-" + String.format("%06d", randomNumber);
            attempts++;

            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique customer code after " + maxAttempts + " attempts");
            }
        } while (customerRepository.existsByCode(code));

        return code;
    }

    public Page<TopCustomerDTO> findTopCustomers(Pageable pageable) {
        return customerRepository.findTopCustomers(pageable);
    }
}

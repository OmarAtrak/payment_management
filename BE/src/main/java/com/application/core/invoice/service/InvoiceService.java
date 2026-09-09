package com.application.core.invoice.service;

import com.application.core.invoice.entity.Invoice;
import com.application.core.invoice.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    @Autowired
    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> findAll() {
        return invoiceRepository.findAllActive();
    }

    public Page<Invoice> findAll(Pageable pageable) {
        return invoiceRepository.findAllActive(pageable);
    }

    public Invoice findById(Long id) {
        return invoiceRepository.findById(id).get();
    }

    public Invoice save(Invoice invoice) {
        if (invoice.getCode() == null || invoice.getCode().isEmpty()) {
            invoice.setCode(generateUniqueCode());
        }
        return this.invoiceRepository.save(invoice);
    }

    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            int randomNumber = (int)(Math.random() * 1000000);
            code = "FACT-" + String.format("%06d", randomNumber);
            attempts++;

            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique invoice code after " + maxAttempts + " attempts");
            }
        } while (invoiceRepository.existsByCode(code));

        return code;
    }
}

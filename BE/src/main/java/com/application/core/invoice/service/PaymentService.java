package com.application.core.invoice.service;

import com.application.core.invoice.entity.Payment;
import com.application.core.invoice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> findAll() {
        return this.paymentRepository.findAllActive();
    }

    public Page<Payment> findAll(Pageable pageable) {
        return this.paymentRepository.findAll(pageable);
    }

    public Payment findById(Long id) {
        return this.paymentRepository.findById(id).get();
    }

    public Payment save(Payment payment) {
        if (payment.getCode() == null || payment.getCode().isEmpty()) {
            payment.setCode(generateUniqueCode());
        }
        return this.paymentRepository.save(payment);
    }

    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            int randomNumber = (int)(Math.random() * 1000000);
            code = "PAY-" + String.format("%06d", randomNumber);
            attempts++;

            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique payment code after " + maxAttempts + " attempts");
            }
        } while (paymentRepository.existsByCode(code));

        return code;
    }
}

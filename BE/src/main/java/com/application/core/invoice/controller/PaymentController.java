package com.application.core.invoice.controller;

import com.application.core.invoice.entity.Invoice;
import com.application.core.invoice.entity.Payment;
import com.application.core.invoice.service.InvoiceService;
import com.application.core.invoice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final InvoiceService invoiceService;

    @Autowired
    public PaymentController(PaymentService paymentService, InvoiceService invoiceService) {
        this.paymentService = paymentService;
        this.invoiceService = invoiceService;
    }

    @GetMapping("/index")
    public Page<Payment> getAll(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return paymentService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable Long id) {
        Payment productItem = paymentService.findById(id);
        if (productItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productItem);
    }

    @PostMapping("/save/{invoiceId}")
    public ResponseEntity<Payment> addPaymentForInvoice(@PathVariable Long invoiceId, @RequestBody Payment productItem) {
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setInvoice(invoice);
        productItem.setActive(true);
        return ResponseEntity.ok(paymentService.save(productItem));
    }

    @PutMapping("/update/{invoiceId}")
    public ResponseEntity<Payment> updatePaymentForInvoice(@PathVariable Long invoiceId, @RequestBody Payment productItem) {
        Payment existingPayment = paymentService.findById(productItem.getId());
        if (existingPayment == null) {
            return ResponseEntity.notFound().build();
        }
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setInvoice(invoice);
        return ResponseEntity.ok(paymentService.save(productItem));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Payment> delete(@PathVariable Long id) {
        Payment productItem = paymentService.findById(id);
        if (productItem == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setActive(false);
        Payment updatedTax = paymentService.save(productItem);
        return ResponseEntity.ok(updatedTax);
    }
}

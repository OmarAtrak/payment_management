package com.application.core.invoice.controller;

import com.application.core.invoice.entity.Invoice;
import com.application.core.invoice.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping("/index")
    public Page<Invoice> getAll(@RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "20") int size,
                            @RequestParam(defaultValue = "id") String sortField,
                            @RequestParam(defaultValue = "desc") String sortDirection) {
        org.springframework.data.domain.Sort.Direction direction;
        try {
            direction = org.springframework.data.domain.Sort.Direction.fromString(sortDirection);
        } catch (IllegalArgumentException e) {
            direction = org.springframework.data.domain.Sort.Direction.DESC;
        }
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by(direction, sortField));
        return invoiceService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getById(@PathVariable Long id) {
        Invoice invoice = invoiceService.findById(id);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(invoice);
    }

    @PostMapping("/save")
    public Invoice create(@RequestBody Invoice invoice) {
        return invoiceService.save(invoice);
    }

    @PutMapping("/update")
    public ResponseEntity<Invoice> update(@RequestBody Invoice invoice) {
        Invoice updatedInvoice = invoiceService.findById(invoice.getId());
        if (updatedInvoice == null) {
            return ResponseEntity.notFound().build();
        }
        invoice.setCreatedDate(updatedInvoice.getCreatedDate());
        return ResponseEntity.ok(invoiceService.save(invoice));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Invoice> delete(@PathVariable Long id) {
        Invoice invoice = invoiceService.findById(id);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        invoice.setActive(false);
        Invoice updatedTax = invoiceService.save(invoice);
        return ResponseEntity.ok(updatedTax);
    }
}

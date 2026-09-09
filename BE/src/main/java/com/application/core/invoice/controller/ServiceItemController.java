package com.application.core.invoice.controller;

import com.application.core.invoice.entity.Invoice;
import com.application.core.invoice.entity.ServiceItem;
import com.application.core.invoice.service.InvoiceService;
import com.application.core.invoice.service.ServiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices/service-items")
public class ServiceItemController {
    private final ServiceItemService serviceItemService;
    private final InvoiceService invoiceService;

    @Autowired
    public ServiceItemController(ServiceItemService serviceItemService, InvoiceService invoiceService) {
        this.serviceItemService = serviceItemService;
        this.invoiceService = invoiceService;
    }

    @GetMapping("/index")
    public Page<ServiceItem> getAll(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return serviceItemService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceItem> getById(@PathVariable Long id) {
        ServiceItem productItem = serviceItemService.findById(id);
        if (productItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productItem);
    }

    @PostMapping("/save/{invoiceId}")
    public ResponseEntity<ServiceItem> addServiceItemForInvoice(@PathVariable Long invoiceId, @RequestBody ServiceItem productItem) {
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setInvoice(invoice);
        productItem.setActive(true);
        return ResponseEntity.ok(serviceItemService.save(productItem));
    }

    @PutMapping("/update/{invoiceId}")
    public ResponseEntity<ServiceItem> updateServiceItemForInvoice(@PathVariable Long invoiceId, @RequestBody ServiceItem productItem) {
        ServiceItem existingServiceItem = serviceItemService.findById(productItem.getId());
        if (existingServiceItem == null) {
            return ResponseEntity.notFound().build();
        }
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setInvoice(invoice);
        return ResponseEntity.ok(serviceItemService.save(productItem));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ServiceItem> delete(@PathVariable Long id) {
        ServiceItem productItem = serviceItemService.findById(id);
        if (productItem == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setActive(false);
        ServiceItem updatedTax = serviceItemService.save(productItem);
        return ResponseEntity.ok(updatedTax);
    }
}

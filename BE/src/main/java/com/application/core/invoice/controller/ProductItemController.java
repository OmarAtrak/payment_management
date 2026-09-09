package com.application.core.invoice.controller;

import com.application.core.invoice.entity.Invoice;
import com.application.core.invoice.entity.ProductItem;
import com.application.core.invoice.service.InvoiceService;
import com.application.core.invoice.service.ProductItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices/product-items")
public class ProductItemController {
    private final ProductItemService productItemService;
    private final InvoiceService invoiceService;

    @Autowired
    public ProductItemController(ProductItemService productItemService, InvoiceService invoiceService) {
        this.productItemService = productItemService;
        this.invoiceService = invoiceService;
    }

    @GetMapping("/index")
    public Page<ProductItem> getAll(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productItemService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductItem> getById(@PathVariable Long id) {
        ProductItem productItem = productItemService.findById(id);
        if (productItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productItem);
    }

    @PostMapping("/save/{invoiceId}")
    public ResponseEntity<ProductItem> addProductItemForInvoice(@PathVariable Long invoiceId, @RequestBody ProductItem productItem) {
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setInvoice(invoice);
        productItem.setActive(true);
        return ResponseEntity.ok(productItemService.save(productItem));
    }

    @PutMapping("/update/{invoiceId}")
    public ResponseEntity<ProductItem> updateProductItemForInvoice(@PathVariable Long invoiceId, @RequestBody ProductItem productItem) {
        ProductItem existingProductItem = productItemService.findById(productItem.getId());
        if (existingProductItem == null) {
            return ResponseEntity.notFound().build();
        }
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setInvoice(invoice);
        return ResponseEntity.ok(productItemService.save(productItem));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductItem> delete(@PathVariable Long id) {
        ProductItem productItem = productItemService.findById(id);
        if (productItem == null) {
            return ResponseEntity.notFound().build();
        }
        productItem.setActive(false);
        ProductItem updatedTax = productItemService.save(productItem);
        return ResponseEntity.ok(updatedTax);
    }
}

package com.application.core.invoice.entity;

import com.application.core.customer.entities.Customer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
@ToString
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date;
    private Boolean active;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "invoice")
    private List<ProductItem> productItems;

    @OneToMany(mappedBy = "invoice")
    private List<ServiceItem> serviceItems;

    private Double amountTva;
    private Double amountTtc;

    private InvoiceStatus status;

    @OneToMany(mappedBy = "invoice")
    private List<Payment> payments;

    private Double discount;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.createdDate = new Date();
        }
    }



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}

